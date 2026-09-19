from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.connection import (
    ConnectionCreate,
    ConnectionOut,
    ConnectionTestResult,
    ConnectionUpdate,
)
from app.schemas.datasource import SampleRowsOut, SchemaOut, TableInfo
from app.services import connection_service, csv_upload_service, schema_service
from app.services.connection_service import ConnectionNotFoundError

router = APIRouter(prefix="/connections", tags=["connections"])


@router.post("", response_model=ConnectionOut)
def create_connection(data: ConnectionCreate, db: Session = Depends(get_db)) -> ConnectionOut:
    if data.type == "csv":
        raise HTTPException(status_code=400, detail="Use /connections/csv-upload to create CSV connections.")
    return connection_service.create_connection(db, data)


@router.post("/csv-upload", response_model=ConnectionOut)
def upload_csv(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> ConnectionOut:
    return csv_upload_service.save_and_register_csv(db, name, file)


@router.get("", response_model=list[ConnectionOut])
def list_connections(db: Session = Depends(get_db)) -> list[ConnectionOut]:
    return connection_service.list_connections(db)


@router.get("/{connection_id}", response_model=ConnectionOut)
def get_connection(connection_id: int, db: Session = Depends(get_db)) -> ConnectionOut:
    try:
        return connection_service.get_connection(db, connection_id)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{connection_id}", response_model=ConnectionOut)
def update_connection(connection_id: int, data: ConnectionUpdate, db: Session = Depends(get_db)) -> ConnectionOut:
    try:
        return connection_service.update_connection(db, connection_id, data)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{connection_id}", status_code=204)
def delete_connection(connection_id: int, db: Session = Depends(get_db)) -> None:
    try:
        connection_service.delete_connection(db, connection_id)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/{connection_id}/test", response_model=ConnectionTestResult)
def test_connection(connection_id: int, db: Session = Depends(get_db)) -> ConnectionTestResult:
    try:
        success, message = connection_service.test_connection(db, connection_id)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return ConnectionTestResult(success=success, message=message)


@router.get("/{connection_id}/tables", response_model=list[TableInfo])
def list_tables(connection_id: int, db: Session = Depends(get_db)) -> list[TableInfo]:
    try:
        return schema_service.list_tables(db, connection_id)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{connection_id}/tables/{table_name}/schema", response_model=SchemaOut)
def get_table_schema(connection_id: int, table_name: str, db: Session = Depends(get_db)) -> SchemaOut:
    try:
        return schema_service.get_schema(db, connection_id, table_name)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{connection_id}/tables/{table_name}/sample", response_model=SampleRowsOut)
def get_table_sample(connection_id: int, table_name: str, db: Session = Depends(get_db)) -> SampleRowsOut:
    try:
        return schema_service.get_sample_rows(db, connection_id, table_name)
    except ConnectionNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
