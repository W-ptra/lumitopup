const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    credentials: "include", // Important for JWT cookies
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // Handle standard { success: true, data: ... } wrapper from backend
  return data.data as T;
}
