def test_list_api_keys_defaults_to_not_configured(client):
    response = client.get("/api/v1/llm/api-keys")
    assert response.status_code == 200
    data = response.json()
    providers = {item["provider"]: item for item in data}
    assert set(providers) == {"openai", "anthropic", "litellm"}
    for item in providers.values():
        assert item["source"] in ("none", "environment")


def test_set_and_get_api_key(client):
    response = client.put("/api/v1/llm/api-keys/anthropic", json={"api_key": "sk-test-123"})
    assert response.status_code == 200
    data = response.json()
    assert data == {"provider": "anthropic", "configured": True, "source": "database", "api_base": None}

    listed = client.get("/api/v1/llm/api-keys").json()
    entry = next(item for item in listed if item["provider"] == "anthropic")
    assert entry["configured"] is True
    assert entry["source"] == "database"


def test_set_api_key_never_returns_the_key_itself(client):
    response = client.put("/api/v1/llm/api-keys/openai", json={"api_key": "sk-super-secret"})
    assert "sk-super-secret" not in response.text


def test_litellm_api_key_can_include_api_base(client):
    response = client.put(
        "/api/v1/llm/api-keys/litellm",
        json={"api_key": "proxy-key", "api_base": "http://localhost:4000"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["api_base"] == "http://localhost:4000"


def test_delete_api_key_reverts_to_not_configured(client):
    client.put("/api/v1/llm/api-keys/anthropic", json={"api_key": "sk-test-123"})

    delete_response = client.delete("/api/v1/llm/api-keys/anthropic")
    assert delete_response.status_code == 204

    listed = client.get("/api/v1/llm/api-keys").json()
    entry = next(item for item in listed if item["provider"] == "anthropic")
    assert entry["source"] in ("none", "environment")


def test_set_api_key_rejects_unknown_provider(client):
    response = client.put("/api/v1/llm/api-keys/not-a-provider", json={"api_key": "x"})
    assert response.status_code == 422


def test_providers_list_reflects_stored_key(client):
    client.put("/api/v1/llm/api-keys/openai", json={"api_key": "sk-abc"})

    response = client.get("/api/v1/llm/providers")
    data = response.json()
    entry = next(item for item in data if item["provider"] == "openai")
    assert entry["configured"] is True
