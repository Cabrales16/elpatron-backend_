import { useState } from "react";
import {
  Play,
  Pause,
  Plus,
  Settings,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Code,
  ArrowRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Modal } from "./Modal";

interface Workflow {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "activo" | "pausado" | "error";
  ejecuciones: number;
  ultimaEjecucion: string;
  exitosas: number;
  fallidas: number;
  pasos: string[];
}

const workflows: Workflow[] = [
  {
    id: 1,
    nombre: "Lead → Validación → VM → Notificación",
    descripcion:
      "Automatización completa del proceso de onboarding de nuevos leads",
    estado: "activo",
    ejecuciones: 1247,
    ultimaEjecucion: "2 min",
    exitosas: 1198,
    fallidas: 49,
    pasos: [
      "Webhook recibe lead",
      "Validar datos",
      "Crear VM segura",
      "Enviar notificación",
      "Registrar en CRM",
    ],
  },
  {
    id: 2,
    nombre: "Auditoría de Seguridad Diaria",
    descripcion: "Escaneo automático de logs y eventos de seguridad cada 24h",
    estado: "activo",
    ejecuciones: 892,
    ultimaEjecucion: "1 hora",
    exitosas: 889,
    fallidas: 3,
    pasos: [
      "Extraer logs",
      "Analizar eventos",
      "Detectar anomalías",
      "Generar reporte",
      "Enviar alerta",
    ],
  },
  {
    id: 3,
    nombre: "Backup Automático de VMs",
    descripcion: "Respaldo programado de todas las máquinas virtuales activas",
    estado: "activo",
    ejecuciones: 456,
    ultimaEjecucion: "3 horas",
    exitosas: 452,
    fallidas: 4,
    pasos: [
      "Listar VMs activas",
      "Crear snapshot",
      "Comprimir datos",
      "Subir a storage",
      "Verificar integridad",
    ],
  },
  {
    id: 4,
    nombre: "Sincronización CRM → Base de Datos",
    descripcion: "Sincronizar leads y datos del CRM principal con BD interna",
    estado: "pausado",
    ejecuciones: 2134,
    ultimaEjecucion: "2 días",
    exitosas: 2100,
    fallidas: 34,
    pasos: [
      "Conectar a CRM",
      "Extraer cambios",
      "Transformar datos",
      "Insertar en BD",
    ],
  },
  {
    id: 5,
    nombre: "Monitoreo de Accesos No Autorizados",
    descripcion: "Detecta intentos de acceso sospechosos en tiempo real",
    estado: "error",
    ejecuciones: 678,
    ultimaEjecucion: "15 min",
    exitosas: 650,
    fallidas: 28,
    pasos: [
      "Monitor de logs",
      "Análisis de patrones",
      "Identificar amenazas",
      "Bloquear IP",
      "Notificar admin",
    ],
  },
];

export function N8NPage() {
  const [isNewWorkflowModal, setIsNewWorkflowModal] = useState(false);
  const [isSettingsModal, setIsSettingsModal] = useState<number | null>(null);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDesc, setWorkflowDesc] = useState("");

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-700";
      case "pausado":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "activo":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pausado":
        return <Pause className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const handleNewWorkflow = () => {
    alert(`Nuevo workflow creado: ${workflowName}`);
    setWorkflowName("");
    setWorkflowDesc("");
    setIsNewWorkflowModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          N8N - Automatizaciones
        </h1>
        <p className="text-slate-600 mt-1">
          Gestión de flujos de trabajo y procesos automatizados
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Workflows Activos</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Ejecuciones (24h)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">2,847</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">97.2%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Tiempo Ahorrado</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">148h</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Workflows</h2>
          <button
            onClick={() => setIsNewWorkflowModal(true)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Workflow
          </button>
        </div>

        <div className="p-6 space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="border border-slate-200 rounded-lg p-5 hover:border-green-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center ${getEstadoColor(workflow.estado)}`}
                  >
                    {getEstadoIcon(workflow.estado)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {workflow.nombre}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {workflow.descripcion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsModal(workflow.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Configurar"
                  >
                    <Settings className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Ver código"
                  >
                    <Code className="w-4 h-4 text-slate-600" />
                  </button>
                  {workflow.estado === "activo" ? (
                    <button
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Pausar"
                    >
                      <Pause className="w-4 h-4 text-slate-600" />
                    </button>
                  ) : (
                    <button
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      title="Activar"
                    >
                      <Play className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500">Total Ejecuciones</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {workflow.ejecuciones.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Exitosas</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    {workflow.exitosas.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fallidas</p>
                  <p className="text-sm font-semibold text-red-600 mt-1">
                    {workflow.fallidas}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Última Ejecución</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {workflow.ultimaEjecucion}
                  </p>
                </div>
              </div>

              {/* Flow Steps */}
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Flujo de pasos:
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {workflow.pasos.map((paso, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 flex-shrink-0"
                    >
                      <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded text-xs text-green-700 whitespace-nowrap">
                        {paso}
                      </div>
                      {index < workflow.pasos.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Workflow Modal */}
      <Modal
        isOpen={isNewWorkflowModal}
        onClose={() => setIsNewWorkflowModal(false)}
        title="Crear Nuevo Workflow"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setIsNewWorkflowModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewWorkflow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nombre del Workflow
            </label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Lead → Validación → VM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Descripción
            </label>
            <textarea
              value={workflowDesc}
              onChange={(e) => setWorkflowDesc(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe qué hace este workflow..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Tipo de Trigger
            </label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Webhook</option>
              <option>Programado</option>
              <option>Manual</option>
              <option>Evento</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModal !== null}
        onClose={() => setIsSettingsModal(null)}
        title={`Configurar Workflow #${isSettingsModal}`}
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsSettingsModal(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                alert("Configuración guardada");
                setIsSettingsModal(null);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Reintentos automáticos
            </label>
            <input
              type="number"
              defaultValue={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Timeout (segundos)
            </label>
            <input
              type="number"
              defaultValue={300}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Notificaciones
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-green-600"
              />
              <span className="text-sm text-slate-700">
                Notificar en errores
              </span>
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" className="w-4 h-4 text-green-600" />
              <span className="text-sm text-slate-700">
                Enviar resumen diario
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
