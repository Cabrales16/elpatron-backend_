import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Server,
  Shield,
  Activity,
  FileText,
  Mail,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Modal } from "./Modal";

const leadsData = [
  { mes: "Ago", nuevos: 145, calificados: 89, convertidos: 34 },
  { mes: "Sep", nuevos: 178, calificados: 112, convertidos: 45 },
  { mes: "Oct", nuevos: 198, calificados: 134, convertidos: 52 },
  { mes: "Nov", nuevos: 223, calificados: 156, convertidos: 61 },
  { mes: "Dic", nuevos: 267, calificados: 189, convertidos: 78 },
  { mes: "Ene", nuevos: 289, calificados: 201, convertidos: 82 },
];

const vmUsageData = [
  { nombre: "Activas", value: 342 },
  { nombre: "Detenidas", value: 89 },
  { nombre: "Mantenimiento", value: 23 },
  { nombre: "Error", value: 8 },
];

const securityEventsData = [
  { día: "Lun", críticos: 2, advertencias: 8, info: 24 },
  { día: "Mar", críticos: 1, advertencias: 12, info: 31 },
  { día: "Mié", críticos: 3, advertencias: 15, info: 28 },
  { día: "Jue", críticos: 0, advertencias: 9, info: 35 },
  { día: "Vie", críticos: 2, advertencias: 11, info: 29 },
  { día: "Sáb", críticos: 1, advertencias: 6, info: 18 },
  { día: "Dom", críticos: 0, advertencias: 4, info: 15 },
];

const automationEfficiencyData = [
  { workflow: "Lead → VM", éxito: 96.2 },
  { workflow: "Auditoría", éxito: 99.7 },
  { workflow: "Backup", éxito: 98.9 },
  { workflow: "Sincronización", éxito: 94.8 },
  { workflow: "Monitoreo", éxito: 95.9 },
];

const COLORS = ["#0d7337", "#10B981", "#F59E0B", "#EF4444"];

export function ReportsPage() {
  const [isExportModal, setIsExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  const handleExport = () => {
    alert(`Reporte exportado en formato ${selectedFormat.toUpperCase()}`);
    setIsExportModal(false);
  };

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
              <p className="text-slate-600 mt-1">
                Análisis y métricas del sistema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
                <option>Últimos 3 meses</option>
                <option>Último año</option>
                <option>Personalizado</option>
              </select>
              <button
                onClick={() => setIsExportModal(true)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Leads Totales</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1,300</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.2% vs mes anterior
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">VMs Gestionadas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">462</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +7.4% vs mes anterior
                </p>
              </div>
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Eventos Seguridad</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">247</p>
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  12 críticos
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Workflows N8N</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
                <p className="text-xs text-green-600 mt-1">
                  97.2% tasa de éxito
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Leads Evolution */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Evolución de Leads
                </h3>
                <p className="text-sm text-slate-500 mt-1">Últimos 6 meses</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="nuevos"
                  fill="#3B82F6"
                  name="Nuevos"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="calificados"
                  fill="#10B981"
                  name="Calificados"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="convertidos"
                  fill="#8B5CF6"
                  name="Convertidos"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* VM Usage Distribution */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Distribución de VMs
                </h3>
                <p className="text-sm text-slate-500 mt-1">Estado actual</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vmUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, value }) => `${nombre}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vmUsageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {vmUsageData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-sm text-slate-700">
                    {item.nombre}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Events Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Eventos de Seguridad
                </h3>
                <p className="text-sm text-slate-500 mt-1">Última semana</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={securityEventsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="día" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="críticos"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Críticos"
                />
                <Line
                  type="monotone"
                  dataKey="advertencias"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Advertencias"
                />
                <Line
                  type="monotone"
                  dataKey="info"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Info"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Automation Efficiency */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Eficiencia de Automatizaciones
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Tasa de éxito por workflow
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={automationEfficiencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  domain={[90, 100]}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  dataKey="workflow"
                  type="category"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="éxito" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModal}
        onClose={() => setIsExportModal(false)}
        title="Exportar Reporte"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsExportModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Exportar
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-600">Selecciona el formato para exportar:</p>
          <div className="space-y-3">
            {[
              {
                id: "pdf",
                label: "PDF",
                icon: FileText,
                desc: "Documento PDF profesional",
              },
              {
                id: "excel",
                label: "Excel",
                icon: FileText,
                desc: "Hoja de cálculo Excel",
              },
              { id: "csv", label: "CSV", icon: FileText, desc: "Archivo CSV" },
              {
                id: "email",
                label: "Enviar por Email",
                icon: Mail,
                desc: "Enviar directamente",
              },
            ].map((format) => (
              <label
                key={format.id}
                className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={selectedFormat === format.id}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <div className="ml-3">
                  <p className="font-medium text-slate-900">{format.label}</p>
                  <p className="text-sm text-slate-500">{format.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
