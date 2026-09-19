import { apiDelete, apiGet, apiPost, apiPostForm, apiPut } from "./client";
import type {
  ConnectionCreate,
  ConnectionOut,
  ConnectionTestResult,
  ConnectionUpdate,
} from "../types/connection";

export function listConnections() {
  return apiGet<ConnectionOut[]>("/connections");
}

export function getConnection(id: number) {
  return apiGet<ConnectionOut>(`/connections/${id}`);
}

export function createConnection(data: ConnectionCreate) {
  return apiPost<ConnectionOut>("/connections", data);
}

export function updateConnection(id: number, data: ConnectionUpdate) {
  return apiPut<ConnectionOut>(`/connections/${id}`, data);
}

export function deleteConnection(id: number) {
  return apiDelete(`/connections/${id}`);
}

export function testConnection(id: number) {
  return apiPost<ConnectionTestResult>(`/connections/${id}/test`);
}

export function uploadCsv(name: string, file: File) {
  const form = new FormData();
  form.append("name", name);
  form.append("file", file);
  return apiPostForm<ConnectionOut>("/connections/csv-upload", form);
}
