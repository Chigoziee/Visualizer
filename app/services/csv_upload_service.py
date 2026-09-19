import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import CSV_UPLOAD_DIR
from app.schemas.connection import ConnectionOut
from app.services.connection_service import create_csv_connection


def save_and_register_csv(db: Session, name: str, upload: UploadFile) -> ConnectionOut:
    original_filename = upload.filename or "upload.csv"
    original_suffix = Path(original_filename).suffix or ".csv"
    stored_filename = f"{uuid.uuid4().hex}{original_suffix}"
    dest_path = CSV_UPLOAD_DIR / stored_filename

    with dest_path.open("wb") as f:
        while chunk := upload.file.read(1024 * 1024):
            f.write(chunk)

    return create_csv_connection(db, name=name, file_path=str(dest_path), original_filename=original_filename)
