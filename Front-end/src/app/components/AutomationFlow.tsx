import { Play, CheckCircle2, Clock, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { Modal } from "./Modal";

const automations = [
  {
    id: 1,
    name: "Lead → Validación → VM → Notificación",
    status: "active",
    executions: 124,
    lastRun: "2 min",
    steps: ["Nuevo Lead", "Validar datos", "Crear VM", "Enviar alerta"],
  },
  {
    id: 2,
    name: "Oportunidad cerrada → Onboarding",
    status: "active",
    executions: 89,
    lastRun: "15 min",
    steps: ["Cierre ganado", "Crear acceso", "Email bienvenida"],
  },
  {
    id: 3,
    name: "Auditoría diaria de seguridad",
    status: "running",
    executions: 1456,
    lastRun: "Ejecutando...",
    steps: ["Analizar logs", "Verificar accesos", "Generar reporte"],
  },
];

export function AutomationFlow() {
  const [showNewAutomationModal, setShowNewAutomationModal] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
  });

  const handleCreateAutomation = () => {
    if (!newAutomation.nombre || !newAutomation.descripcion) {
      alert("Por favor completa los campos requeridos");
      return;
    }
    alert(`Automatización creada: ${newAutomation.nombre}`);
    setNewAutomation({
      nombre: "",
      descripcion: "",
      estado: "activo",
    });
    setShowNewAutomationModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Automatizaciones Activas
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Flujos n8n en ejecución
            </p>
          </div>
          <button
            onClick={() => setShowNewAutomationModal(true)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Automatización
          </button>
        </div>

        <div className="space-y-4">
          {automations.map((automation) => (
            <div
              key={automation.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-green-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${
                      automation.status === "running"
                        ? "bg-green-100"
                        : "bg-green-100"
                    }`}
                  >
                    {automation.status === "running" ? (
                      <Clock className="w-4 h-4 text-green-600 animate-pulse" />
                    ) : (
                      <Play className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {automation.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {automation.executions} ejecuciones · Última:{" "}
                      {automation.lastRun}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    automation.status === "running"
                      ? "bg-green-100 text-green-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {automation.status === "running" ? "Ejecutando" : "Activo"}
                </span>
              </div>

              {/* Flow Steps */}
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
                {automation.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 whitespace-nowrap">
                      {step}
                    </div>
                    {index < automation.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nueva Automatización */}
      <Modal
        isOpen={showNewAutomationModal}
        onClose={() => setShowNewAutomationModal(false)}
        title="Nueva Automatización"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewAutomationModal(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateAutomation}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Crear Automatización
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Automatización
            </label>
            <input
              type="text"
              placeholder="Ej: Lead → Validación → VM → Notificación"
              value={newAutomation.nombre}
              onChange={(e) =>
                setNewAutomation({ ...newAutomation, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Describe el flujo de automatización"
              value={newAutomation.descripcion}
              onChange={(e) =>
                setNewAutomation({
                  ...newAutomation,
                  descripcion: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado Inicial
            </label>
            <select
              value={newAutomation.estado}
              onChange={(e) =>
                setNewAutomation({ ...newAutomation, estado: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="activo">Activo</option>
              <option value="pausado">Pausado</option>
              <option value="prueba">En Prueba</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Después de crear la automatización, podrás
              configurar los pasos y triggers en el editor visual de N8N.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
