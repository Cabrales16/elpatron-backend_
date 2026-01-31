import {
  Plus,
  Server,
  Power,
  PowerOff,
  Settings,
  Activity,
  HardDrive,
  Cpu,
  MoreVertical,
  AlertCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Modal } from "./Modal";

interface VirtualMachine {
  id: number;
  nombre: string;
  cliente: string;
  sistema: string;
  estado: "activa" | "detenida" | "mantenimiento" | "error";
  cpu: string;
  ram: string;
  disco: string;
  ip: string;
  fechaCreacion: string;
  ultimoAcceso: string;
  uptime: string;
}

const vmsData: VirtualMachine[] = [
  {
    id: 1,
    nombre: "vm-acme-prod-01",
    cliente: "Acme Corporation",
    sistema: "Ubuntu Server 22.04 LTS",
    estado: "activa",
    cpu: "8 vCPUs",
    ram: "32 GB",
    disco: "500 GB SSD",
    ip: "10.0.1.15",
    fechaCreacion: "2025-12-15",
    ultimoAcceso: "2 min",
    uptime: "45 días",
  },
  {
    id: 2,
    nombre: "vm-techcorp-dev-01",
    cliente: "TechCorp Solutions",
    sistema: "Windows Server 2022",
    estado: "activa",
    cpu: "4 vCPUs",
    ram: "16 GB",
    disco: "250 GB SSD",
    ip: "10.0.1.23",
    fechaCreacion: "2026-01-10",
    ultimoAcceso: "15 min",
    uptime: "21 días",
  },
  {
    id: 3,
    nombre: "vm-dataservices-backup",
    cliente: "Data Services SA",
    sistema: "CentOS 8",
    estado: "detenida",
    cpu: "2 vCPUs",
    ram: "8 GB",
    disco: "1 TB HDD",
    ip: "10.0.1.47",
    fechaCreacion: "2025-11-20",
    ultimoAcceso: "2 días",
    uptime: "0 días",
  },
  {
    id: 4,
    nombre: "vm-cloudsys-staging",
    cliente: "CloudSys Inc",
    sistema: "Ubuntu Server 22.04 LTS",
    estado: "activa",
    cpu: "16 vCPUs",
    ram: "64 GB",
    disco: "1 TB NVMe",
    ip: "10.0.1.89",
    fechaCreacion: "2026-01-05",
    ultimoAcceso: "5 min",
    uptime: "26 días",
  },
  {
    id: 5,
    nombre: "vm-securenet-test-02",
    cliente: "SecureNet",
    sistema: "Debian 11",
    estado: "mantenimiento",
    cpu: "4 vCPUs",
    ram: "16 GB",
    disco: "200 GB SSD",
    ip: "10.0.1.112",
    fechaCreacion: "2026-01-20",
    ultimoAcceso: "1 hora",
    uptime: "11 días",
  },
  {
    id: 6,
    nombre: "vm-innovatech-prod",
    cliente: "InnovaTech",
    sistema: "Red Hat Enterprise Linux 9",
    estado: "error",
    cpu: "8 vCPUs",
    ram: "32 GB",
    disco: "500 GB SSD",
    ip: "10.0.1.156",
    fechaCreacion: "2026-01-25",
    ultimoAcceso: "30 min",
    uptime: "6 días",
  },
];

export function VirtualMachinesPage() {
  const [showNewVmModal, setShowNewVmModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [newVm, setNewVm] = useState({
    nombre: "",
    cliente: "",
    sistema: "",
    cpu: "4",
    ram: "8",
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-green-100 text-green-700";
      case "detenida":
        return "bg-slate-100 text-slate-700";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "activa":
        return <Power className="w-4 h-4" />;
      case "detenida":
        return <PowerOff className="w-4 h-4" />;
      case "mantenimiento":
        return <Settings className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const estadoCounts = {
    activa: vmsData.filter((vm) => vm.estado === "activa").length,
    detenida: vmsData.filter((vm) => vm.estado === "detenida").length,
    mantenimiento: vmsData.filter((vm) => vm.estado === "mantenimiento").length,
    error: vmsData.filter((vm) => vm.estado === "error").length,
  };

  const handleNewVm = () => {
    if (!newVm.nombre || !newVm.cliente) {
      alert("Por favor completa los campos requeridos");
      return;
    }
    alert(`VM creada: ${newVm.nombre}`);
    setNewVm({
      nombre: "",
      cliente: "",
      sistema: "",
      cpu: "4",
      ram: "8",
    });
    setShowNewVmModal(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Máquinas Virtuales
        </h1>
        <p className="text-slate-600 mt-1">
          Gestión y monitoreo de entornos virtuales seguros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total VMs</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {vmsData.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Activas</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {estadoCounts.activa}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Power className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">En Mantenimiento</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {estadoCounts.mantenimiento}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Con Errores</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {estadoCounts.error}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
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
                  placeholder="Buscar por nombre, cliente, IP..."
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
                <option value="activa">Activas</option>
                <option value="detenida">Detenidas</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="error">Error</option>
              </select>
            </div>
            <button
              onClick={() => setShowNewVmModal(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva VM
            </button>
          </div>
        </div>

        {/* VMs Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vmsData
            .filter((vm) => {
              const matchSearch =
                searchTerm === "" ||
                vm.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vm.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vm.ip.includes(searchTerm);
              const matchEstado =
                selectedEstado === "todos" || vm.estado === selectedEstado;
              return matchSearch && matchEstado;
            })
            .map((vm) => (
              <div
                key={vm.id}
                className="border border-slate-200 rounded-lg p-5 hover:border-green-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEstadoColor(vm.estado)}`}
                    >
                      {getEstadoIcon(vm.estado)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {vm.nombre}
                      </h3>
                      <p className="text-sm text-slate-600">{vm.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getEstadoColor(vm.estado)}`}
                    >
                      {vm.estado.charAt(0).toUpperCase() + vm.estado.slice(1)}
                    </span>
                    <button className="p-1 hover:bg-slate-100 rounded">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* System Info */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">
                    Sistema Operativo
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {vm.sistema}
                  </p>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Cpu className="w-3 h-3 text-slate-500" />
                      <p className="text-xs text-slate-600">CPU</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {vm.cpu}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-slate-500" />
                      <p className="text-xs text-slate-600">RAM</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {vm.ram}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <HardDrive className="w-3 h-3 text-slate-500" />
                      <p className="text-xs text-slate-600">Disco</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {vm.disco}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <p className="text-slate-600">IP</p>
                    <p className="font-medium text-slate-900">{vm.ip}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Uptime</p>
                    <p className="font-medium text-slate-900">{vm.uptime}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Último acceso</p>
                    <p className="font-medium text-slate-900">
                      {vm.ultimoAcceso}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Creada</p>
                    <p className="font-medium text-slate-900">
                      {new Date(vm.fechaCreacion).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                  {vm.estado === "activa" ? (
                    <button className="flex-1 px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                      <PowerOff className="w-4 h-4" />
                      Detener
                    </button>
                  ) : (
                    <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                      <Power className="w-4 h-4" />
                      Iniciar
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 bg-slate-50 text-slate-700 text-sm font-medium rounded hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal Nueva VM */}
      <Modal
        isOpen={showNewVmModal}
        onClose={() => setShowNewVmModal(false)}
        title="Nueva Máquina Virtual"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewVmModal(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewVm}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Crear VM
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la VM
            </label>
            <input
              type="text"
              placeholder="ej: vm-produccion-01"
              value={newVm.nombre}
              onChange={(e) => setNewVm({ ...newVm, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cliente
            </label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={newVm.cliente}
              onChange={(e) => setNewVm({ ...newVm, cliente: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sistema Operativo
            </label>
            <select
              value={newVm.sistema}
              onChange={(e) => setNewVm({ ...newVm, sistema: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar...</option>
              <option value="Ubuntu Server 22.04 LTS">
                Ubuntu Server 22.04 LTS
              </option>
              <option value="Windows Server 2022">Windows Server 2022</option>
              <option value="CentOS 9">CentOS 9</option>
              <option value="Debian 11">Debian 11</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                CPU (vCPUs)
              </label>
              <input
                type="number"
                value={newVm.cpu}
                onChange={(e) => setNewVm({ ...newVm, cpu: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                max="64"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                RAM (GB)
              </label>
              <input
                type="number"
                value={newVm.ram}
                onChange={(e) => setNewVm({ ...newVm, ram: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="2"
                max="256"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
