from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import require_admin
from app.database import get_session
from app.models import Lead, User
from app.schemas import AdminLeadRead

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/leads", response_model=list[AdminLeadRead])
def list_admin_leads(
    _current_user: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> list[AdminLeadRead]:
    leads = session.scalars(select(Lead).order_by(Lead.created_at.desc())).all()
    return [
        AdminLeadRead(
            id=lead.id,
            product_id=lead.product_id,
            product_name=lead.product.name if lead.product else None,
            name=lead.name,
            email=lead.email,
            company=lead.company,
            role=lead.role,
            message=lead.message,
            configuration=lead.configuration,
            created_at=lead.created_at,
        )
        for lead in leads
    ]
