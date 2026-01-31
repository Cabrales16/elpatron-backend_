// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_PREFIX = "/api";

export class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any,
  ): Promise<T> {
    const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>("/auth/login", "POST", {
      email,
      password,
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<any>("/auth/register", "POST", {
      email,
      password,
      name,
    });
    this.setToken(response.access_token);
    return response;
  }

  // User endpoints
  async getMe() {
    return this.request("/me", "GET");
  }

  async getUsers() {
    return this.request<any[]>("/users", "GET");
  }

  async createUser(
    email: string,
    password: string,
    name: string,
    role: string = "OPERATOR",
  ) {
    return this.request("/users", "POST", {
      email,
      password,
      name,
      role,
    });
  }

  // Operation endpoints
  async getOperations() {
    return this.request<any[]>("/operations", "GET");
  }

  async createOperation(title: string) {
    return this.request("/operations", "POST", {
      title,
    });
  }

  async updateOperationStatus(operationId: number, status: string) {
    return this.request(`/operations/${operationId}/status`, "PATCH", {
      status,
    });
  }

  // Workspace endpoints
  async getWorkspaces() {
    return this.request<any[]>("/workspaces", "GET");
  }

  async getMyWorkspace() {
    return this.request("/workspaces/me", "GET");
  }
}

export const apiClient = new ApiClient();
