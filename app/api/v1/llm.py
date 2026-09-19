from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.llm.factory import PROVIDER_MODELS
from app.schemas.llm import ApiKeyStatus, ApiKeyUpdate, LLMDefault, LLMProviderName, ProviderModels
from app.services import api_key_service
from app.services.llm_settings_service import get_default_llm, set_default_llm

router = APIRouter(prefix="/llm", tags=["llm"])


@router.get("/providers", response_model=list[ProviderModels])
def list_providers(db: Session = Depends(get_db)) -> list[ProviderModels]:
    result = []
    for provider, models in PROVIDER_MODELS.items():
        configured, _source, _api_base = api_key_service.get_api_key_status(db, provider)
        result.append(ProviderModels(provider=provider, models=models, configured=configured))
    return result


@router.get("/default", response_model=LLMDefault)
def get_default() -> LLMDefault:
    return get_default_llm()


@router.put("/default", response_model=LLMDefault)
def set_default(default: LLMDefault) -> LLMDefault:
    try:
        return set_default_llm(default)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/api-keys", response_model=list[ApiKeyStatus])
def list_api_keys(db: Session = Depends(get_db)) -> list[ApiKeyStatus]:
    result = []
    for provider in PROVIDER_MODELS:
        configured, source, api_base = api_key_service.get_api_key_status(db, provider)
        result.append(ApiKeyStatus(provider=provider, configured=configured, source=source, api_base=api_base))
    return result


@router.put("/api-keys/{provider}", response_model=ApiKeyStatus)
def set_api_key(provider: LLMProviderName, data: ApiKeyUpdate, db: Session = Depends(get_db)) -> ApiKeyStatus:
    api_key_service.set_api_key(db, provider, data.api_key, data.api_base)
    configured, source, api_base = api_key_service.get_api_key_status(db, provider)
    return ApiKeyStatus(provider=provider, configured=configured, source=source, api_base=api_base)


@router.delete("/api-keys/{provider}", status_code=204)
def delete_api_key(provider: LLMProviderName, db: Session = Depends(get_db)) -> None:
    api_key_service.delete_api_key(db, provider)
