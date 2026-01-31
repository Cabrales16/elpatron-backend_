import {
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Building,
  TrendingUp,
  MoreVertical,
  Eye,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { apiClient } from "../services/api";
import { StatusChip } from "./enterprise/GovernanceComponents";

interface Lead {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: "NUEVO" | "CONTACTADO" | "CALIFICADO" | "PERDIDO";
  origen: string;
  valor_estimado: number;
  fechaCreacion?: string;
  created_at?: string;
  quality_score?: number;
}

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadModal, setIsNewLeadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [newLead, setNewLead] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
  });

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const workspaceId = 1;
        const response = await apiClient.getLeads({ workspaceId });
        console.log("Leads loaded from backend:", response);
        setLeads(response.data || []);
      } catch (error) {
        console.error("Error loading leads:", error);
        // Datos de ejemplo si el backend no está disponible
        setLeads([
          {
            id: 1,
            nombre: "Ana García",
            email: "ana.garcia@techcorp.com",
            telefono: "+34 612 345 678",
            empresa: "TechCorp Solutions",
            estado: "CALIFICADO",
            origen: "Web",
            valor_estimado: 45000,
            created_at: "2026-01-28",
            quality_score: 95,
          },
          {
            id: 2,
            nombre: "Roberto Martínez",
            email: "r.martinez@innovatech.com",
            telefono: "+34 623 456 789",
            empresa: "InnovaTech",
            estado: "CONTACTADO",
            origen: "Referido",
            valor_estimado: 32000,
            created_at: "2026-01-29",
            quality_score: 85,
          },
          {
            id: 3,
            nombre: "Laura Fernández",
            email: "laura.f@dataservices.com",
            telefono: "+34 634 567 890",
            empresa: "Data Services SA",
            estado: "NUEVO",
            origen: "LinkedIn",
            valor_estimado: 58000,
            created_at: "2026-01-30",
            quality_score: 90,
          },
          {
            id: 4,
            nombre: "Carlos Ruiz",
            email: "carlos.ruiz@cloudsys.com",
            telefono: "+34 645 678 901",
            empresa: "CloudSys Inc",
            estado: "CALIFICADO",
            origen: "Web",
            valor_estimado: 67000,
            created_at: "2026-01-30",
            quality_score: 95,
          },
          {
            id: 5,
            nombre: "María López",
            email: "m.lopez@securenet.com",
            telefono: "+34 656 789 012",
            empresa: "SecureNet",
            estado: "NUEVO",
            origen: "Evento",
            valor_estimado: 41000,
            created_at: "2026-01-31",
            quality_score: 85,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const getEstadoColor = (estado: string) => {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case "NUEVO":
        return "bg-green-100 text-green-700";
      case "CONTACTADO":
        return "bg-yellow-100 text-yellow-700";
      case "CALIFICADO":
        return "bg-green-100 text-green-700";
      case "PERDIDO":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const handleNewLead = () => {
    alert(`Nuevo lead creado: ${newLead.nombre}`);
    setNewLead({ nombre: "", email: "", telefono: "", empresa: "" });
    setIsNewLeadModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-slate-600 mt-1">
          Gestión de prospectos y oportunidades de venta
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">847</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Nuevos (7d)</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">124</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Calificados</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">342</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Valor Estimado</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">$2.4M</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
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
                  placeholder="Buscar por nombre, empresa, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="propuesta">Propuesta</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <button
              onClick={() => setIsNewLeadModal(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Lead
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Lead
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Contacto
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Origen
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Valor Est.
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Cargando leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No hay leads disponibles
                  </td>
                </tr>
              ) : (
                leads
                  .filter((lead) => {
                    const matchSearch =
                      searchTerm === "" ||
                      lead.nombre
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      lead.empresa
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchEstado =
                      selectedEstado === "todos" ||
                      lead.estado.toUpperCase() === selectedEstado.toUpperCase();
                    return matchSearch && matchEstado;
                  })
                  .map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-900">
                            {lead.nombre}
                          </div>
                          <div className="text-sm text-slate-500">
                            {lead.empresa}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            {lead.telefono}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={lead.estado} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {lead.origen}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        ${(lead.valor_estimado || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {lead.created_at || lead.fechaCreacion}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {lead.created_at || lead.fechaCreacion}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-1 hover:bg-slate-100 rounded">
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Modal */}
      <Modal
        isOpen={isNewLeadModal}
        onClose={() => setIsNewLeadModal(false)}
        title="Nuevo Lead"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsNewLeadModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewLead}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Crear Lead
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={newLead.nombre}
              onChange={(e) =>
                setNewLead({ ...newLead, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={newLead.email}
              onChange={(e) =>
                setNewLead({ ...newLead, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="email@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={newLead.telefono}
              onChange={(e) =>
                setNewLead({ ...newLead, telefono: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+34 600 000 000"
            />
          </div>
        </div>
      </Modal>

      {/* Lead Details Modal */}
      <Modal
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        title="Detalles del Lead"
        size="md"
        footer={
          <>
            <button
              onClick={() => setSelectedLead(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Editar
            </button>
          </>
        }
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-semibold text-slate-900">
                  {selectedLead.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-medium ${getEstadoColor(selectedLead.estado)}`}
                >
                  {selectedLead.estado}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold text-slate-900">
                {selectedLead.email}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Teléfono</p>
                <p className="font-semibold text-slate-900">
                  {selectedLead.telefono}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Empresa</p>
                <p className="font-semibold text-slate-900">
                  {selectedLead.empresa}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Valor</p>
                <p className="font-semibold text-green-600">
                  ${selectedLead.valor.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Origen</p>
                <p className="font-semibold text-slate-900">
                  {selectedLead.origen}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
