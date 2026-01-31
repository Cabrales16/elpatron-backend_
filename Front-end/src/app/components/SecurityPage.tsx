import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Activity,
  Eye,
  Search,
  Filter,
  Bell,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface SecurityEvent {
  id: number;
  tipo: "crítico" | "advertencia" | "info" | "éxito";
  titulo: string;
  descripcion: string;
  timestamp: string;
  origen: string;
  accion?: string;
}

interface SecurityMetric {
  label: string;
  value: string;
  status: "success" | "warning" | "error";
  icon: any;
  change?: string;
}

const securityEvents: SecurityEvent[] = [
  {
    id: 1,
    tipo: "crítico",
    titulo: "Intento de acceso no autorizado detectado",
    descripcion:
      "Múltiples intentos fallidos de login desde IP 185.220.101.45 - Bloqueado automáticamente",
    timestamp: "2026-01-31 14:23:15",
    origen: "Sistema de Autenticación",
    accion: "IP bloqueada por 24h",
  },
  {
    id: 2,
    tipo: "advertencia",
    titulo: "Certificado SSL próximo a vencer",
    descripcion: "El certificado SSL para vm-acme-prod-01 vencerá en 15 días",
    timestamp: "2026-01-31 13:45:00",
    origen: "Monitor de Certificados",
    accion: "Renovación programada",
  },
  {
    id: 3,
    tipo: "éxito",
    titulo: "Backup completado exitosamente",
    descripcion: "Backup automático de todas las VMs finalizado sin errores",
    timestamp: "2026-01-31 12:00:00",
    origen: "Sistema de Backup",
  },
  {
    id: 4,
    tipo: "info",
    titulo: "Nuevo usuario añadido",
    descripcion:
      "Usuario ana.garcia@empresa.com agregado con rol de Administrador",
    timestamp: "2026-01-31 11:30:22",
    origen: "Gestión de Usuarios",
  },
  {
    id: 5,
    tipo: "advertencia",
    titulo: "Uso de CPU elevado en VM",
    descripcion:
      "vm-techcorp-dev-01 ha superado el 85% de uso de CPU durante 30 minutos",
    timestamp: "2026-01-31 10:15:00",
    origen: "Monitor de Recursos",
  },
  {
    id: 6,
    tipo: "crítico",
    titulo: "Actividad sospechosa detectada",
    descripcion:
      "Patrón anómalo de consultas a la base de datos desde vm-cloudsys-staging",
    timestamp: "2026-01-31 09:42:10",
    origen: "Sistema de Detección de Anomalías",
    accion: "Alerta enviada a admin",
  },
  {
    id: 7,
    tipo: "éxito",
    titulo: "Auditoría de seguridad completada",
    descripcion:
      "Escaneo mensual de vulnerabilidades finalizado - 0 vulnerabilidades críticas",
    timestamp: "2026-01-31 08:00:00",
    origen: "Scanner de Vulnerabilidades",
  },
  {
    id: 8,
    tipo: "info",
    titulo: "Actualización de firewall aplicada",
    descripcion: "Nuevas reglas de firewall implementadas en todas las VMs",
    timestamp: "2026-01-31 07:30:00",
    origen: "Gestión de Firewall",
  },
];

const securityMetrics: SecurityMetric[] = [
  {
    label: "Nivel de Seguridad General",
    value: "98.7%",
    status: "success",
    icon: Shield,
    change: "+0.3% vs ayer",
  },
  {
    label: "Cifrado Activo",
    value: "AES-256",
    status: "success",
    icon: Lock,
  },
  {
    label: "MFA Habilitado",
    value: "100%",
    status: "success",
    icon: CheckCircle2,
  },
  {
    label: "Eventos Activos",
    value: "3",
    status: "warning",
    icon: AlertTriangle,
    change: "2 críticos",
  },
];

export function SecurityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "crítico":
        return "bg-red-100 text-red-700 border-red-300";
      case "advertencia":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "éxito":
        return "bg-green-100 text-green-700 border-green-300";
      case "info":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "crítico":
        return <XCircle className="w-5 h-5" />;
      case "advertencia":
        return <AlertTriangle className="w-5 h-5" />;
      case "éxito":
        return <CheckCircle2 className="w-5 h-5" />;
      case "info":
        return <Bell className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Seguridad y Alertas
        </h1>
        <p className="text-slate-600 mt-1">
          Monitoreo en tiempo real de eventos de seguridad y cumplimiento
        </p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const statusColors = {
            success: "bg-green-100 text-green-600",
            warning: "bg-yellow-100 text-yellow-600",
            error: "bg-red-100 text-red-600",
          };

          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${statusColors[metric.status]} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {metric.value}
              </p>
              {metric.change && (
                <p className="text-xs text-slate-500">{metric.change}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">ISO 27001</h3>
              <p className="text-xs text-green-600">Certificado activo</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Última auditoría: 15 Dic 2025
          </p>
          <p className="text-sm text-slate-600">
            Próxima revisión: 15 Jun 2026
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">GDPR</h3>
              <p className="text-xs text-green-600">Cumplimiento total</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Políticas de privacidad actualizadas
          </p>
          <p className="text-sm text-slate-600">
            Consentimientos: 100% válidos
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">SOC 2 Type II</h3>
              <p className="text-xs text-green-600">Certificado vigente</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Última auditoría: 10 Ene 2026
          </p>
          <p className="text-sm text-slate-600">Próxima: 10 Ene 2027</p>
        </div>
      </div>

      {/* Events Log */}
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Registro de Eventos
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos los tipos</option>
                <option value="crítico">Críticos</option>
                <option value="advertencia">Advertencias</option>
                <option value="info">Info</option>
                <option value="éxito">Éxito</option>
              </select>
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="p-6 space-y-3">
          {(() => {
            const filteredEvents = securityEvents.filter((event) => {
              const matchSearch =
                searchTerm === "" ||
                event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.descripcion
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                event.origen.toLowerCase().includes(searchTerm.toLowerCase());
              const matchTipo =
                selectedTipo === "todos" || event.tipo === selectedTipo;
              return matchSearch && matchTipo;
            });

            const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

            return paginatedEvents.map((event) => (
              <div
                key={event.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTipoColor(event.tipo)}`}
                  >
                    {getTipoIcon(event.tipo)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {event.titulo}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {event.descripcion}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getTipoColor(event.tipo)} whitespace-nowrap ml-3`}
                      >
                        {event.tipo.charAt(0).toUpperCase() +
                          event.tipo.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {event.origen}
                      </span>
                      <span>{event.timestamp}</span>
                      {event.accion && (
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                          {event.accion}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {(() => {
              const filteredEvents = securityEvents.filter((event) => {
                const matchSearch =
                  searchTerm === "" ||
                  event.titulo
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  event.descripcion
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  event.origen.toLowerCase().includes(searchTerm.toLowerCase());
                const matchTipo =
                  selectedTipo === "todos" || event.tipo === selectedTipo;
                return matchSearch && matchTipo;
              });
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = Math.min(
                startIndex + itemsPerPage,
                filteredEvents.length,
              );
              return `Mostrando ${filteredEvents.length === 0 ? 0 : Math.min(startIndex + 1, filteredEvents.length)}-${endIndex} de ${filteredEvents.length} eventos`;
            })()}
          </p>
          <div className="flex items-center gap-2">
            {(() => {
              const filteredEvents = securityEvents.filter((event) => {
                const matchSearch =
                  searchTerm === "" ||
                  event.titulo
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  event.descripcion
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  event.origen.toLowerCase().includes(searchTerm.toLowerCase());
                const matchTipo =
                  selectedTipo === "todos" || event.tipo === selectedTipo;
                return matchSearch && matchTipo;
              });
              const totalPages = Math.ceil(
                filteredEvents.length / itemsPerPage,
              );

              return (
                <>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded text-sm ${
                          currentPage === page
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
