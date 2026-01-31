import {
  Search,
  Bell,
  User,
  Home,
  Users,
  CheckSquare,
  Zap,
  BarChart3,
  Lock,
  Settings,
  Server,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  category: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <Home className="w-4 h-4" />,
    category: "Principal",
  },
  {
    id: "leads",
    label: "Leads",
    path: "/leads",
    icon: <Users className="w-4 h-4" />,
    category: "Gestión",
  },
  {
    id: "tasks",
    label: "Tareas",
    path: "/tasks",
    icon: <CheckSquare className="w-4 h-4" />,
    category: "Gestión",
  },
  {
    id: "automation",
    label: "Automatización",
    path: "/automation",
    icon: <Zap className="w-4 h-4" />,
    category: "Herramientas",
  },
  {
    id: "n8n",
    label: "N8N Workflows",
    path: "/n8n",
    icon: <Zap className="w-4 h-4" />,
    category: "Herramientas",
  },
  {
    id: "reports",
    label: "Reportes",
    path: "/reports",
    icon: <BarChart3 className="w-4 h-4" />,
    category: "Análisis",
  },
  {
    id: "security",
    label: "Seguridad",
    path: "/security",
    icon: <Lock className="w-4 h-4" />,
    category: "Admin",
  },
  {
    id: "vms",
    label: "Máquinas Virtuales",
    path: "/vms",
    icon: <Server className="w-4 h-4" />,
    category: "Infraestructura",
  },
  {
    id: "config",
    label: "Configuración",
    path: "/config",
    icon: <Settings className="w-4 h-4" />,
    category: "Admin",
  },
];

export function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("userAuthenticated");
    navigate("/login");
  };

  const filteredItems = searchTerm.trim()
    ? menuItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleNavigate = (path: string) => {
    navigate(path);
    setSearchTerm("");
    setShowResults(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar apartados, configuración, herramientas..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => searchTerm.trim() && setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setShowResults(false);
                  setSearchTerm("");
                }}
              />

              {/* Results Panel */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  <div className="py-2">
                    {/* Group by category */}
                    {Array.from(
                      new Set(filteredItems.map((item) => item.category)),
                    ).map((category) => (
                      <div key={category}>
                        <div className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-50 sticky top-0">
                          {category}
                        </div>
                        {filteredItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(item.path)}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                            >
                              <div className="text-green-600">{item.icon}</div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900">
                                  {item.label}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {category}
                                </div>
                              </div>
                              <div className="text-slate-400 text-xs">↵</div>
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      No se encontraron resultados para "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-slate-200 relative">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">
                Carlos Mendoza
              </div>
              <div className="text-xs text-slate-500">Administrador</div>
            </div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-colors"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 w-48">
                  <button
                    onClick={() => {
                      navigate("/configuracion");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-50 transition-colors text-left text-sm text-slate-900 border-b border-slate-100"
                  >
                    <Settings className="w-4 h-4 text-slate-600" />
                    Configuración
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-red-50 transition-colors text-left text-sm text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
