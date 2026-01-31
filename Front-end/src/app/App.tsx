import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardPage } from "./components/DashboardPage";
import { LeadsPage } from "./components/LeadsPage";
import { TasksPage } from "./components/TasksPage";
import { N8NPage } from "./components/N8NPage";
import { VirtualMachinesPage } from "./components/VirtualMachinesPage";
import { SecurityPage } from "./components/SecurityPage";
import { ReportsPage } from "./components/ReportsPage";
import { ConfigPage } from "./components/ConfigPage";

export default function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/tareas" element={<TasksPage />} />
            <Route path="/n8n" element={<N8NPage />} />
            <Route
              path="/maquinas-virtuales"
              element={<VirtualMachinesPage />}
            />
            <Route path="/seguridad" element={<SecurityPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/configuracion" element={<ConfigPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
