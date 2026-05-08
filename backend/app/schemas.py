from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    tagline: str
    description: str
    category: str
    price: int
    accent: str
    hero_image: str
    features: list[str]
    specs: dict[str, Any]


class LeadCreate(BaseModel):
    product_id: str | None = None
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str | None = Field(default=None, max_length=160)
    role: str | None = Field(default=None, max_length=120)
    message: str | None = Field(default=None, max_length=600)
    configuration: dict[str, Any] = Field(default_factory=dict)


class LeadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: str | None
    name: str
    email: EmailStr
    company: str | None
    role: str | None
    message: str | None
    configuration: dict[str, Any]
    created_at: datetime


class StatsRead(BaseModel):
    products: int
    leads: int
    average_price: float
    latest_lead_at: datetime | None

