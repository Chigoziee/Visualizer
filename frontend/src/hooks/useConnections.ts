import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as connectionsApi from "../api/connections";
import type { ConnectionCreate, ConnectionUpdate } from "../types/connection";

const CONNECTIONS_KEY = ["connections"];

export function useConnections() {
  return useQuery({ queryKey: CONNECTIONS_KEY, queryFn: connectionsApi.listConnections });
}

export function useConnection(id: number | undefined) {
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, id],
    queryFn: () => connectionsApi.getConnection(id!),
    enabled: id !== undefined,
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConnectionCreate) => connectionsApi.createConnection(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}

export function useUploadCsv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file }: { name: string; file: File }) => connectionsApi.uploadCsv(name, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}

export function useUpdateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConnectionUpdate }) =>
      connectionsApi.updateConnection(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}

export function useDeleteConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => connectionsApi.deleteConnection(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}

export function useTestConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => connectionsApi.testConnection(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}
