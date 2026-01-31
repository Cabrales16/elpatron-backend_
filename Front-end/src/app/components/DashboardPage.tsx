import { KPICard } from "./KPICard";
import { AutomationFlow } from "./AutomationFlow";
import { SecurityPanel } from "./SecurityPanel";
import { AssignTaskPanel } from "./AssignTaskPanel";
import {
  Users,
  Target,
  Cloud,
  ShieldCheck,
  Activity,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../services/api";
import { authService } from "../services/auth";
import {
  StatusChip,
  ContextBadge,
  SystemDecision,
  GovernanceIndicator,
} from "./enterprise/GovernanceComponents";

export function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);

        // Cargar usuario actual
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Workspace por defecto (el primero siempre será ID 1 según seed)
        const workspaceId = 1;

        // Cargar métricas del dashboard
        const metricsResponse =
          await apiClient.getDashboardMetrics(workspaceId);
        console.log("Metrics loaded:", metricsResponse);
        setMetrics(metricsResponse.data);

        // Cargar operaciones recientes
        const opsResponse = await apiClient.getOperations({ workspaceId });
        console.log("Operations loaded:", opsResponse);
        setOperations(opsResponse.data || []);

        // Cargar métricas de seguridad
        const secResponse = await apiClient.getSecurityMetrics(workspaceId);
        console.log("Security metrics loaded:", secResponse);
        setSecurityMetrics(secResponse.data);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);

        // Si el backend no está disponible, usar datos de ejemplo para que no esté vacío
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("conexión")
        ) {
          console.log("Backend no disponible, usando datos de ejemplo");

          // Datos de ejemplo basados en el seed para mostrar todas las funcionalidades
          setMetrics({
            total: 12,
            new: 3,
            inProgress: 5,
            completed: 3,
            blocked: 1,
            restricted: 2,
            avgRiskScore: "67.25",
            avgConfidence: "82.40",
            governanceLevel: "ACTIVE",
          });

          setOperations([
            {
              id: 1,
              title: "Implementar sistema de backup automático",
              status: "IN_PROGRESS",
              statusLabel: "En Ejecución",
              priority: "HIGH",
              risk_score: 65,
              confidence_level: 85,
              governance_mode: "CONTROLLED",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 2,
              title: "Auditoría de seguridad mensual",
              status: "NEW",
              statusLabel: "Nueva",
              priority: "CRITICAL",
              risk_score: 85,
              confidence_level: 70,
              governance_mode: "CONTROLLED",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 3,
              title: "Actualización de certificados SSL",
              status: "COMPLETED",
              statusLabel: "Completada",
              priority: "MEDIUM",
              risk_score: 45,
              confidence_level: 95,
              governance_mode: "AUTOMATED",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 4,
              title: "Configuración de firewall avanzado",
              status: "BLOCKED",
              statusLabel: "Bloqueada",
              priority: "HIGH",
              risk_score: 90,
              confidence_level: 60,
              governance_mode: "RESTRICTED",
              blocked_reason:
                "Requiere aprobación manual por política de seguridad",
              blocked_by: "SECURITY_POLICY",
              created_at: new Date(Date.now() - 172800000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 5,
              title: "Migración de base de datos a cloud",
              status: "RESTRICTED",
              statusLabel: "Restringida",
              priority: "CRITICAL",
              risk_score: 78,
              confidence_level: 75,
              governance_mode: "VALIDATION_REQUIRED",
              validation_reason:
                "Requiere validación de compliance antes de proceder",
              created_at: new Date(Date.now() - 259200000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 6,
              title: "Implementación de monitoreo en tiempo real",
              status: "VALIDATED",
              statusLabel: "Validada",
              priority: "MEDIUM",
              risk_score: 35,
              confidence_level: 98,
              governance_mode: "APPROVED",
              created_at: new Date(Date.now() - 345600000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 7,
              title: "Optimización de rendimiento del sistema",
              status: "IN_PROGRESS",
              statusLabel: "En Ejecución",
              priority: "HIGH",
              risk_score: 55,
              confidence_level: 88,
              governance_mode: "CONTROLLED",
              created_at: new Date(Date.now() - 432000000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 8,
              title: "Entrenamiento de modelo de IA para detección de fraudes",
              status: "NEW",
              statusLabel: "Nueva",
              priority: "HIGH",
              risk_score: 72,
              confidence_level: 80,
              governance_mode: "CONTROLLED",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

          setSecurityMetrics({
            totalEvents: 24,
            criticalEvents: 3,
            warningEvents: 8,
            infoEvents: 13,
            autoBlocked: 2,
            pendingReview: 4,
            avgSeverity: "42.15",
            governanceLevel: "MONITORING",
            recentEvents: [
              {
                id: 1,
                type: "CRITICAL",
                message: "Intento de acceso no autorizado detectado",
                timestamp: new Date().toISOString(),
                source: "Firewall",
              },
              {
                id: 2,
                type: "WARNING",
                message: "Múltiples intentos de login fallidos",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                source: "Authentication",
              },
              {
                id: 3,
                type: "INFO",
                message: "Actualización de políticas de seguridad aplicada",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                source: "Policy Engine",
              },
            ],
          });

          setError(null); // Limpiar error ya que usamos datos de ejemplo
        } else {
          setError(err.message || "Error cargando datos del dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Activity className="w-8 h-8 text-green-600 animate-pulse" />
            <p className="text-slate-600 font-medium">
              Sistema cargando datos...
            </p>
            <p className="text-slate-500 text-sm">Gobernado y validado</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto p-8">
        <SystemDecision
          type="BLOCKED"
          title="Error de Conexión con Backend"
          message={error}
          policy="SYSTEM_ERROR"
        />
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            🚀 Para iniciar el backend:
          </h3>
          <div className="bg-white rounded p-3 font-mono text-sm">
            <p className="text-slate-600 mb-2"># Terminal 1 - Backend</p>
            <p className="text-green-600">cd backend</p>
            <p className="text-green-600">npm install</p>
            <p className="text-green-600">npm run db:seed</p>
            <p className="text-green-600">npm run dev</p>
          </div>
          <p className="text-sm text-blue-700 mt-3">
            Ver{" "}
            <a href="SETUP.md" className="underline font-medium">
              SETUP.md
            </a>{" "}
            para instrucciones completas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Centro de Mando - {user?.name}
            </h1>
            <p className="text-slate-600 mt-1">
              Sistema de control operativo bajo gobierno
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusChip status="ACTIVE" label="Sistema Operativo" size="lg" />
            {metrics && metrics.governanceLevel && (
              <ContextBadge type="governance" value={metrics.governanceLevel} />
            )}
          </div>
        </div>
      </div>

      {/* Governance Indicator */}
      {metrics && (
        <div className="mb-6">
          <GovernanceIndicator
            level={
              (metrics.blocked || 0) + (metrics.restricted || 0) > 5
                ? "HIGH"
                : (metrics.blocked || 0) + (metrics.restricted || 0) > 2
                  ? "MEDIUM"
                  : "LOW"
            }
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Operaciones Totales"
          value={metrics?.total?.toString() || "0"}
          change={metrics?.new || 0}
          changeLabel="nuevas operaciones"
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <KPICard
          title="En Ejecución"
          value={metrics?.inProgress?.toString() || "0"}
          change={metrics?.inProgress || 0}
          changeLabel="activas"
          icon={Target}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <KPICard
          title="Completadas"
          value={metrics?.completed?.toString() || "0"}
          change={metrics?.completed || 0}
          changeLabel="finalizadas"
          icon={Cloud}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <KPICard
          title="Control de Gobierno"
          value={`${metrics?.blocked || 0} / ${metrics?.restricted || 0}`}
          change={0}
          changeLabel="bloqueadas / restringidas"
          icon={ShieldCheck}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </div>

      {/* System Decisions - Mostrar decisiones recientes */}
      {operations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Decisiones del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operations
              .filter(
                (op) =>
                  op.status === "BLOCKED" ||
                  op.status === "RESTRICTED" ||
                  op.status === "VALIDATED",
              )
              .slice(0, 2)
              .map((op) => (
                <SystemDecision
                  key={op.id}
                  type={
                    op.status === "BLOCKED"
                      ? "BLOCKED"
                      : op.status === "RESTRICTED"
                        ? "REQUIRES_VALIDATION"
                        : "APPROVED"
                  }
                  title={op.statusLabel || op.status}
                  message={`${op.title} - ${op.blocked_reason || op.validation_reason || "Validado automáticamente"}`}
                  policy={op.blocked_by || op.governance_mode}
                  timestamp={new Date(op.updated_at).toLocaleString("es-ES")}
                />
              ))}
          </div>
        </div>
      )}

      {/* Metrics Cards - Risk & Confidence */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-3">
              Nivel de Riesgo Promedio
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">
                {metrics.avgRiskScore}%
              </div>
              <ContextBadge
                type="risk"
                value={parseFloat(metrics.avgRiskScore || "0")}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-3">
              Confianza del Sistema
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">
                {metrics.avgConfidence}%
              </div>
              <ContextBadge
                type="confidence"
                value={parseFloat(metrics.avgConfidence || "0")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Metrics */}
      {securityMetrics && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                Estado de Seguridad
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-green-700">Eventos Totales</p>
                <p className="text-2xl font-bold text-green-900">
                  {securityMetrics.totalEvents}
                </p>
              </div>
              <div>
                <p className="text-sm text-red-700">Críticos</p>
                <p className="text-2xl font-bold text-red-900">
                  {securityMetrics.criticalEvents}
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700">Auto-bloqueados</p>
                <p className="text-2xl font-bold text-orange-900">
                  {securityMetrics.autoBlocked}
                </p>
              </div>
              <div>
                <p className="text-sm text-yellow-700">Pendientes Revisión</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {securityMetrics.pendingReview}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Automation Flow - Spans 2 columns */}
        <div className="lg:col-span-2">
          <AutomationFlow />
        </div>

        {/* Security Panel */}
        <div>
          <SecurityPanel />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Assign Task Panel */}
        <div>
          <AssignTaskPanel />
        </div>
      </div>
    </div>
  );
}
