import { Plus, User, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "./Modal";

interface Task {
  id: number;
  title: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  dueDate: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Configurar VM para cliente nuevo",
    assignee: "Carlos Mendoza",
    priority: "high",
    status: "in-progress",
    dueDate: "2026-02-01",
  },
  {
    id: 2,
    title: "Revisar logs de seguridad",
    assignee: "Ana García",
    priority: "medium",
    status: "todo",
    dueDate: "2026-02-03",
  },
  {
    id: 3,
    title: "Actualizar documentación N8N",
    assignee: "Luis Torres",
    priority: "low",
    status: "todo",
    dueDate: "2026-02-05",
  },
];

const teamMembers = [
  "Carlos Mendoza",
  "Ana García",
  "Luis Torres",
  "Laura Fernández",
  "Roberto Martínez",
];

export function AssignTaskPanel() {
  const [showModal, setShowModal] = useState(false);
  const [tasks] = useState<Task[]>(mockTasks);
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    priority: "medium" as const,
    dueDate: "",
  });
  const navigate = useNavigate();

  const handleAssignTask = () => {
    if (!newTask.title || !newTask.assignee || !newTask.dueDate) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    alert(`Tarea asignada a ${newTask.assignee}: ${newTask.title}`);
    setNewTask({
      title: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    });
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Asignar Tareas
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Gestión rápida de asignaciones
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Asignar tarea
        </button>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-green-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-slate-900 text-sm">
                {task.title}
              </h4>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.priority === "high"
                  ? "Alta"
                  : task.priority === "medium"
                    ? "Media"
                    : "Baja"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString("es-ES")}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded ${
                  task.status === "done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.status === "done"
                  ? "Completada"
                  : task.status === "in-progress"
                    ? "En progreso"
                    : "Por hacer"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/tareas")}
        className="w-full mt-4 py-2 text-sm text-green-600 font-medium hover:bg-green-50 rounded-lg transition-colors"
      >
        Ver todas las tareas →
      </button>

      {/* Modal Asignar Tarea */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Asignar Nueva Tarea"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAssignTask}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Asignar
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título de la Tarea
            </label>
            <input
              type="text"
              placeholder="ej: Configurar VM para cliente X"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Asignar a
            </label>
            <select
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar miembro del equipo</option>
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prioridad
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">Notificación automática</p>
              <p>
                Se enviará una notificación al miembro del equipo cuando asignes
                la tarea.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
