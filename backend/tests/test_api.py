from __future__ import annotations

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import Base, get_session
from app.main import app
from app.seed import seed_products


@pytest.fixture()
def client(tmp_path) -> Generator[TestClient, None, None]:
    database_url = f"sqlite:///{tmp_path / 'test.db'}"
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        seed_products(session)

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

