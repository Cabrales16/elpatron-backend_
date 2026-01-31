import {
  Plus,
  Filter,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Modal } from "./Modal";

interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  asignado: string;
  creador: string;
  prioridad: "baja" | "media" | "alta" | "crítica";
  estado: "por-hacer" | "en-progreso" | "en-revision" | "completada";
  fechaCreacion: string;
  fechaVencimiento: string;
  etiquetas: string[];
}

const tareasData: Task[] = [
  {
    id: 1,
    titulo: "Configurar VM para cliente Acme Corp",
    descripcion:
      "Crear y configurar máquina virtual con especificaciones de seguridad enterprise",
    asignado: "Carlos Mendoza",
    creador: "Ana García",
    prioridad: "alta",
    estado: "en-progreso",
    fechaCreacion: "2026-01-29",
    fechaVencimiento: "2026-02-01",
    etiquetas: ["VM", "Infraestructura", "Cliente"],
  },
  {
    id: 2,
    titulo: "Revisar logs de seguridad del último mes",
    descripcion:
      "Análisis completo de eventos de seguridad y accesos no autorizados",
    asignado: "Laura Fernández",
    creador: "Carlos Mendoza",
    prioridad: "crítica",
    estado: "por-hacer",
    fechaCreacion: "2026-01-30",
    fechaVencimiento: "2026-02-01",
    etiquetas: ["Seguridad", "Auditoría"],
  },
  {
    id: 3,
    titulo: "Actualizar documentación de workflows N8N",
    descripcion: "Documentar los nuevos flujos de automatización implementados",
    asignado: "Roberto Martínez",
    creador: "Luis Torres",
    prioridad: "media",
    estado: "en-revision",
    fechaCreacion: "2026-01-28",
    fechaVencimiento: "2026-02-03",
    etiquetas: ["Documentación", "N8N"],
  },
  {
    id: 4,
    titulo: "Seguimiento lead TechCorp Solutions",
    descripcion: "Llamada de seguimiento y envío de propuesta comercial",
    asignado: "Ana García",
    creador: "Carlos Mendoza",
    prioridad: "alta",
    estado: "por-hacer",
    fechaCreacion: "2026-01-31",
    fechaVencimiento: "2026-02-01",
    etiquetas: ["Ventas", "Lead"],
  },
  {
    id: 5,
    titulo: "Optimizar backup automático de VMs",
    descripcion:
      "Mejorar el proceso de backup para reducir tiempo de ejecución",
    asignado: "Luis Torres",
    creador: "Roberto Martínez",
    prioridad: "media",
    estado: "completada",
    fechaCreacion: "2026-01-25",
    fechaVencimiento: "2026-01-30",
    etiquetas: ["Automatización", "VM", "Backup"],
  },
  {
    id: 6,
    titulo: "Configurar alertas de accesos sospechosos",
    descripcion:
      "Implementar sistema de alertas en tiempo real para intentos de acceso no autorizado",
    asignado: "Laura Fernández",
    creador: "Carlos Mendoza",
    prioridad: "alta",
    estado: "en-progreso",
    fechaCreacion: "2026-01-30",
    fechaVencimiento: "2026-02-02",
    etiquetas: ["Seguridad", "Monitoreo"],
  },
  {
    id: 7,
    titulo: "Preparar reporte mensual de KPIs",
    descripcion: "Generar reporte ejecutivo con métricas del mes de enero",
    asignado: "Roberto Martínez",
    creador: "Ana García",
    prioridad: "baja",
    estado: "por-hacer",
    fechaCreacion: "2026-01-31",
    fechaVencimiento: "2026-02-05",
    etiquetas: ["Reportes", "Análisis"],
  },
];

export function TasksPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("todas");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState({
    prioridad: "",
    asignado: "",
    creador: "",
  });
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media" as const,
    asignado: "",
    fechaVencimiento: "",
  });

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "crítica":
        return "bg-red-100 text-red-700 border-red-300";
      case "alta":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "media":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "baja":
        return "bg-slate-100 text-slate-600 border-slate-300";
      default:
        return "bg-slate-100 text-slate-600 border-slate-300";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completada":
        return "bg-green-100 text-green-700";
      case "en-progreso":
        return "bg-green-100 text-green-700";
      case "en-revision":
        return "bg-purple-100 text-purple-700";
      case "por-hacer":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completada":
        return <CheckCircle2 className="w-4 h-4" />;
      case "en-progreso":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "en-revision":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const estadoLabels = {
    "por-hacer": "Por hacer",
    "en-progreso": "En progreso",
    "en-revision": "En revisión",
    completada: "Completada",
  };

  // Obtener lista de personas únicas
  const uniqueAssignees = [...new Set(tareasData.map((t) => t.asignado))];
  const uniqueCreators = [...new Set(tareasData.map((t) => t.creador))];

  // Filtrado avanzado
  let filteredTasks = tareasData;

  // Filtrar por estado
  if (selectedStatus !== "todas") {
    filteredTasks = filteredTasks.filter(
      (task) => task.estado === selectedStatus,
    );
  }

  // Filtrar por búsqueda
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.titulo.toLowerCase().includes(searchLower) ||
        task.descripcion.toLowerCase().includes(searchLower) ||
        task.etiquetas.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
  }

  // Filtrar por prioridad
  if (filters.prioridad) {
    filteredTasks = filteredTasks.filter(
      (task) => task.prioridad === filters.prioridad,
    );
  }

  // Filtrar por asignado
  if (filters.asignado) {
    filteredTasks = filteredTasks.filter(
      (task) => task.asignado === filters.asignado,
    );
  }

  // Filtrar por creador
  if (filters.creador) {
    filteredTasks = filteredTasks.filter(
      (task) => task.creador === filters.creador,
    );
  }

  const tasksByStatus = {
    "por-hacer": tareasData.filter((t) => t.estado === "por-hacer").length,
    "en-progreso": tareasData.filter((t) => t.estado === "en-progreso").length,
    "en-revision": tareasData.filter((t) => t.estado === "en-revision").length,
    completada: tareasData.filter((t) => t.estado === "completada").length,
  };

  const handleNewTask = () => {
    if (!newTask.titulo || !newTask.descripcion) {
      alert("Por favor completa los campos requeridos");
      return;
    }
    alert(`Tarea creada: ${newTask.titulo}`);
    setNewTask({
      titulo: "",
      descripcion: "",
      prioridad: "media",
      asignado: "",
      fechaVencimiento: "",
    });
    setShowNewTaskModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
        <p className="text-slate-600 mt-1">
          Sistema de gestión de tareas tipo JIRA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Por Hacer</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {tasksByStatus["por-hacer"]}
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">En Progreso</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {tasksByStatus["en-progreso"]}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">En Revisión</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {tasksByStatus["en-revision"]}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Completadas</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {tasksByStatus["completada"]}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="todas">Todas</option>
                <option value="por-hacer">Por hacer</option>
                <option value="en-progreso">En progreso</option>
                <option value="en-revision">En revisión</option>
                <option value="completada">Completada</option>
              </select>

              <button
                onClick={() => setShowFiltersModal(true)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Más filtros
                {(filters.prioridad || filters.asignado || filters.creador) && (
                  <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {(filters.prioridad ? 1 : 0) +
                      (filters.asignado ? 1 : 0) +
                      (filters.creador ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6 space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="border border-slate-200 rounded-lg p-5 hover:border-green-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(task.estado)} flex items-center gap-1`}
                    >
                      {getEstadoIcon(task.estado)}
                      {estadoLabels[task.estado]}
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium border ${getPrioridadColor(task.prioridad)}`}
                    >
                      {task.prioridad.charAt(0).toUpperCase() +
                        task.prioridad.slice(1)}
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">
                    {task.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {task.descripcion}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>
                        Asignado:{" "}
                        <span className="font-medium">{task.asignado}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>
                        Creador:{" "}
                        <span className="font-medium">{task.creador}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Vence:{" "}
                        <span className="font-medium">
                          {new Date(task.fechaVencimiento).toLocaleDateString(
                            "es-ES",
                          )}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {task.etiquetas.map((etiqueta, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
                      >
                        {etiqueta}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nueva Tarea */}
      <Modal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        title="Nueva Tarea"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewTaskModal(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewTask}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Crear Tarea
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título
            </label>
            <input
              type="text"
              placeholder="Título de la tarea"
              value={newTask.titulo}
              onChange={(e) =>
                setNewTask({ ...newTask, titulo: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Descripción detallada de la tarea"
              value={newTask.descripcion}
              onChange={(e) =>
                setNewTask({ ...newTask, descripcion: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prioridad
              </label>
              <select
                value={newTask.prioridad}
                onChange={(e) =>
                  setNewTask({ ...newTask, prioridad: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="crítica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                value={newTask.fechaVencimiento}
                onChange={(e) =>
                  setNewTask({ ...newTask, fechaVencimiento: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Asignado a
            </label>
            <input
              type="text"
              placeholder="Nombre de la persona"
              value={newTask.asignado}
              onChange={(e) =>
                setNewTask({ ...newTask, asignado: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </Modal>

      {/* Modal Filtros Avanzados */}
      <Modal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title="Filtros Avanzados"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setFilters({
                  prioridad: "",
                  asignado: "",
                  creador: "",
                });
              }}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setShowFiltersModal(false)}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Aplicar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prioridad
            </label>
            <select
              value={filters.prioridad}
              onChange={(e) =>
                setFilters({ ...filters, prioridad: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="crítica">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Asignado a
            </label>
            <select
              value={filters.asignado}
              onChange={(e) =>
                setFilters({ ...filters, asignado: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los asignados</option>
              {uniqueAssignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Creador
            </label>
            <select
              value={filters.creador}
              onChange={(e) =>
                setFilters({ ...filters, creador: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los creadores</option>
              {uniqueCreators.map((creator) => (
                <option key={creator} value={creator}>
                  {creator}
                </option>
              ))}
            </select>
          </div>

          {(filters.prioridad || filters.asignado || filters.creador) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                Filtros activos:
                {filters.prioridad && (
                  <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">
                    Prioridad: {filters.prioridad}
                  </span>
                )}
                {filters.asignado && (
                  <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">
                    Asignado: {filters.asignado}
                  </span>
                )}
                {filters.creador && (
                  <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">
                    Creador: {filters.creador}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
