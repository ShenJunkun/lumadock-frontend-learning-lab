from __future__ import annotations

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import Base, get_session
from app.main import app, get_cors_origins
from app.seed import seed_products, seed_users


@pytest.fixture()
def client(tmp_path) -> Generator[TestClient, None, None]:
    database_url = f"sqlite:///{tmp_path / 'test.db'}"
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        seed_products(session)
        seed_users(session)

    def override_get_session():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_session] = override_get_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_products(client: TestClient) -> None:
    response = client.get("/api/products")

    assert response.status_code == 200
    products = response.json()
    assert len(products) == 3
    assert products[0]["id"] == "lumadock-air"


def test_get_product_detail(client: TestClient) -> None:
    response = client.get("/api/products/lumadock-studio")

    assert response.status_code == 200
    assert response.json()["name"] == "LumaDock Studio"


def test_get_product_not_found(client: TestClient) -> None:
    response = client.get("/api/products/missing")

    assert response.status_code == 404


def test_create_lead_and_stats_persist(client: TestClient) -> None:
    response = client.post(
        "/api/leads",
        json={
            "product_id": "lumadock-studio",
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "company": "Analytical Engines",
            "role": "Design Lead",
            "message": "I want to try the Studio configuration.",
            "configuration": {"finish": "graphite", "stand": "floating"},
        },
    )

    assert response.status_code == 201
    assert response.json()["id"] == 1

    stats_response = client.get("/api/stats")
    assert stats_response.status_code == 200
    assert stats_response.json()["leads"] == 1


def test_create_lead_validates_fields(client: TestClient) -> None:
    response = client.post(
        "/api/leads",
        json={
            "product_id": "lumadock-studio",
            "name": "A",
            "email": "not-an-email",
        },
    )

    assert response.status_code == 422


def test_login_success_and_me(client: TestClient) -> None:
    login_response = client.post(
        "/api/auth/login",
        json={"email": "admin@lumadock.local", "password": "admin123"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    assert login_response.json()["user"]["role"] == "admin"

    me_response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "admin@lumadock.local"


def test_login_rejects_bad_password(client: TestClient) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@lumadock.local", "password": "wrong"},
    )

    assert response.status_code == 401


def test_me_requires_token(client: TestClient) -> None:
    response = client.get("/api/auth/me")

    assert response.status_code == 401


def login_as(client: TestClient, email: str, password: str) -> str:
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]


def create_demo_lead(client: TestClient) -> None:
    response = client.post(
        "/api/leads",
        json={
            "product_id": "lumadock-studio",
            "name": "Katherine Johnson",
            "email": "katherine@example.com",
            "company": "Orbital Labs",
            "role": "Operations",
            "message": "Please schedule a team walkthrough.",
            "configuration": {"finish": "pearl"},
        },
    )
    assert response.status_code == 201


def test_admin_can_list_leads(client: TestClient) -> None:
    create_demo_lead(client)
    token = login_as(client, "admin@lumadock.local", "admin123")

    response = client.get("/api/admin/leads", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    leads = response.json()
    assert len(leads) == 1
    assert leads[0]["product_name"] == "LumaDock Studio"


def test_viewer_cannot_list_admin_leads(client: TestClient) -> None:
    token = login_as(client, "viewer@lumadock.local", "viewer123")

    response = client.get("/api/admin/leads", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 403


def test_admin_leads_requires_token(client: TestClient) -> None:
    response = client.get("/api/admin/leads")

    assert response.status_code == 401


def test_openapi_contracts_expose_frontend_shapes(client: TestClient) -> None:
    schema = client.get("/openapi.json").json()
    schemas = schema["components"]["schemas"]

    assert {"id", "name", "price", "features", "specs"}.issubset(
        schemas["ProductRead"]["properties"].keys()
    )
    assert {"access_token", "token_type", "user"}.issubset(
        schemas["TokenResponse"]["properties"].keys()
    )
    assert {"product_name", "configuration", "created_at"}.issubset(
        schemas["AdminLeadRead"]["properties"].keys()
    )


def test_cors_origins_are_configurable(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "https://lumadock.example, http://127.0.0.1:5173")

    assert get_cors_origins() == ["https://lumadock.example", "http://127.0.0.1:5173"]
