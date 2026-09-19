from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class QueryHistory(Base):
    __tablename__ = "query_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    connection_id: Mapped[int | None] = mapped_column(
        ForeignKey("data_source_connections.id", ondelete="SET NULL"), nullable=True
    )
    data_source_name: Mapped[str] = mapped_column(String(255), nullable=False)
    table_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    llm_provider: Mapped[str] = mapped_column(String(32), nullable=False)
    llm_model: Mapped[str] = mapped_column(String(128), nullable=False)
    generated_code: Mapped[str | None] = mapped_column(Text, nullable=True)

    execution_status: Mapped[str] = mapped_column(String(16), nullable=False)  # success | error | timeout
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    chart_image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    duration_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    @property
    def has_image(self) -> bool:
        return self.chart_image_path is not None
