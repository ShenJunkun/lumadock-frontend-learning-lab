from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.admin import router as admin_router
from app.auth import router as auth_router
from app.database import SessionLocal, get_session, init_db
from app.models import Lead, Product
from app.schemas import LeadCreate, LeadRead, ProductRead, StatsRead
from app.seed import seed_products, seed_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    with SessionLocal() as session:
        seed_products(session)
        seed_users(session)
    yield


app = FastAPI(
    title="LumaDock Learning API",
    version="0.1.0",
    description="Local REST API for the LumaDock frontend learning project.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "lumadock-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/products", response_model=list[ProductRead])
def list_products(session: Session = Depends(get_session)) -> list[Product]:
    return list(session.scalars(select(Product).order_by(Product.price)).all())


@app.get("/api/products/{product_id}", response_model=ProductRead)
def get_product(product_id: str, session: Session = Depends(get_session)) -> Product:
    product = session.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@app.get("/api/stats", response_model=StatsRead)
def get_stats(session: Session = Depends(get_session)) -> StatsRead:
    product_count = session.scalar(select(func.count()).select_from(Product)) or 0
    lead_count = session.scalar(select(func.count()).select_from(Lead)) or 0
    average_price = session.scalar(select(func.avg(Product.price))) or 0
    latest_lead_at = session.scalar(select(func.max(Lead.created_at)))
    return StatsRead(
        products=product_count,
        leads=lead_count,
        average_price=round(float(average_price), 2),
        latest_lead_at=latest_lead_at,
    )


@app.post("/api/leads", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, session: Session = Depends(get_session)) -> Lead:
    if payload.product_id and session.get(Product, payload.product_id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown product")

    lead = Lead(**payload.model_dump())
    session.add(lead)
    session.commit()
    session.refresh(lead)
    return lead
