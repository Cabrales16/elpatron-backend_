// ============================================================================
// EL PATRÓN - API Client Enterprise
// Sistema de Control Operativo con Gobierno Automático
// ============================================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_PREFIX = "/api";

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  governed?: boolean;
  governance?: {
    type: string;
    title: string;
    message: string;
    policy?: string;
  };
}

export class ApiClient {
  private token: string | null = null;

  constructor() {
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
  ): Promise<ApiResponse<T>> {
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

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${data.status}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || "Error de conexión con el servidor");
    }
  }

  // ========================================================================
  // User & Auth
  // ========================================================================

  async getMe() {
    return this.request<any>("/me", "GET");
  }

  // ========================================================================
  // Operations - Centro de Control
  // ========================================================================

  async getOperations(filters?: {
    workspaceId?: number;
    status?: string;
    type?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.workspaceId)
      params.append("workspaceId", filters.workspaceId.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.type) params.append("type", filters.type);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any[]>(`/operations${query}`, "GET");
  }

  async getOperationById(id: number) {
    return this.request<any>(`/operations/${id}`, "GET");
  }

  async createOperation(data: {
    title: string;
    description?: string;
    type?: string;
    priority?: string;
    workspaceId: number;
  }) {
    return this.request<any>("/operations", "POST", data);
  }

  async updateOperationStatus(
    operationId: number,
    status: string,
    reason?: string,
  ) {
    return this.request<any>(`/operations/${operationId}/status`, "PATCH", {
      status,
      reason,
    });
  }

  async getDashboardMetrics(workspaceId?: number) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
    return this.request<any>(`/operations/dashboard/metrics${query}`, "GET");
  }

  // ========================================================================
  // Leads - Gestión Comercial
  // ========================================================================

  async getLeads(filters?: { workspaceId?: number; estado?: string }) {
    const params = new URLSearchParams();
    if (filters?.workspaceId)
      params.append("workspaceId", filters.workspaceId.toString());
    if (filters?.estado) params.append("estado", filters.estado);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any[]>(`/leads${query}`, "GET");
  }

  async createLead(data: {
    workspaceId: number;
    nombre: string;
    email: string;
    telefono?: string;
    empresa?: string;
    origen?: string;
    valor_estimado?: number;
  }) {
    return this.request<any>("/leads", "POST", data);
  }

  // ========================================================================
  // Tasks - Control de Ejecución
  // ========================================================================

  async getTasks(filters?: {
    workspaceId?: number;
    estado?: string;
    assigned_to?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.workspaceId)
      params.append("workspaceId", filters.workspaceId.toString());
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.assigned_to)
      params.append("assigned_to", filters.assigned_to.toString());

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any[]>(`/tasks${query}`, "GET");
  }

  async createTask(data: {
    workspaceId: number;
    titulo: string;
    descripcion?: string;
    prioridad?: string;
    assigned_to?: number;
    fecha_vencimiento?: string;
    operation_id?: number;
  }) {
    return this.request<any>("/tasks", "POST", data);
  }

  // ========================================================================
  // Virtual Machines - Infraestructura
  // ========================================================================

  async getVirtualMachines(filters?: {
    workspaceId?: number;
    estado?: string;
    cliente?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.workspaceId)
      params.append("workspaceId", filters.workspaceId.toString());
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.cliente) params.append("cliente", filters.cliente);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any[]>(`/vms${query}`, "GET");
  }

  async createVirtualMachine(data: {
    workspaceId: number;
    nombre: string;
    cliente?: string;
    sistema_operativo?: string;
    cpu_vcpus?: number;
    ram_gb?: number;
    disco_gb?: number;
    tipo_disco?: string;
  }) {
    return this.request<any>("/vms", "POST", data);
  }

  // ========================================================================
  // Security - Monitoreo y Alertas
  // ========================================================================

  async getSecurityEvents(filters?: {
    workspaceId?: number;
    tipo?: string;
    categoria?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.workspaceId)
      params.append("workspaceId", filters.workspaceId.toString());
    if (filters?.tipo) params.append("tipo", filters.tipo);
    if (filters?.categoria) params.append("categoria", filters.categoria);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any[]>(`/security/events${query}`, "GET");
  }

  async getSecurityMetrics(workspaceId?: number) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
    return this.request<any>(`/security/metrics${query}`, "GET");
  }
}

export const apiClient = new ApiClient();
