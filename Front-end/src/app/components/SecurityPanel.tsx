import {
  Shield,
  Lock,
  AlertTriangle,
  Activity,
  CheckCircle2,
} from "lucide-react";

const securityMetrics = [
  { label: "Cifrado activo", status: "success", icon: Lock },
  { label: "Cumplimiento ISO 27001", status: "success", icon: CheckCircle2 },
  { label: "MFA habilitado", status: "success", icon: Shield },
  { label: "Auditoría en tiempo real", status: "warning", icon: Activity },
];

const recentEvents = [
  {
    type: "success",
    message: "Acceso autorizado desde nueva ubicación",
    time: "5 min",
    user: "admin@empresa.com",
  },
  {
    type: "warning",
    message: "Intento de acceso fallido detectado",
    time: "12 min",
    user: "unknown",
  },
  {
    type: "info",
    message: "Backup automático completado",
    time: "1 h",
    user: "Sistema",
  },
  {
    type: "success",
    message: "VM creada para nuevo cliente",
    time: "2 h",
    user: "carlos.mendoza@empresa.com",
  },
];

export function SecurityPanel() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Seguridad y Alertas
          </h3>
          <p className="text-sm text-slate-500">Estado del sistema</p>
        </div>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                metric.status === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-4 h-4 ${
                    metric.status === "success"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
                <span className="text-xs font-medium text-slate-700">
                  {metric.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">
          Eventos Recientes
        </h4>
        <div className="space-y-2">
          {recentEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  event.type === "success"
                    ? "bg-green-500"
                    : event.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-900 leading-relaxed">
                  {event.message}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {event.user} · {event.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
