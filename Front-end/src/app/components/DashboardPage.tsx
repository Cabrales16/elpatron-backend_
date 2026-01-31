import { KPICard } from "./KPICard";
import { AutomationFlow } from "./AutomationFlow";
import { SecurityPanel } from "./SecurityPanel";
import { AssignTaskPanel } from "./AssignTaskPanel";
import { Users, Target, Cloud, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../services/api";
import { authService } from "../services/auth";

export function DashboardPage() {
  const [operations, setOperations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar usuario actual
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Cargar operaciones
        const ops = await apiClient.getOperations();
        setOperations(ops);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
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
          <p className="text-slate-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Calcular métricas
  const totalOperations = operations.length;
  const newOperations = operations.filter((op) => op.status === "NEW").length;
  const inProgressOperations = operations.filter(
    (op) => op.status === "IN_PROGRESS",
  ).length;
  const completedOperations = operations.filter(
    (op) => op.status === "DONE",
  ).length;
  return (
    <div className="max-w-[1600px] mx-auto p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard - Bienvenido {user?.name}
        </h1>
        <p className="text-slate-600 mt-1">
          Resumen ejecutivo y métricas clave de operaciones
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total de Operaciones"
          value={totalOperations.toString()}
          change={newOperations}
          changeLabel="operaciones nuevas"
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <KPICard
          title="En Progreso"
          value={inProgressOperations.toString()}
          change={inProgressOperations}
          changeLabel="actualmente en progreso"
          icon={Target}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <KPICard
          title="Completadas"
          value={completedOperations.toString()}
          change={completedOperations}
          changeLabel="finalizadas"
          icon={Cloud}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <KPICard
          title="Nivel de Seguridad"
          value={user?.role === "ADMIN" ? "ADMIN" : "OPERADOR"}
          change={0}
          changeLabel="rol de usuario"
          icon={ShieldCheck}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </div>

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
