import {
  LayoutDashboard,
  Users,
  Target,
  Zap,
  Cloud,
  Shield,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logoColor from "../../../assets/logoColor.png";
import { authService } from "../services/auth";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  { id: "leads", label: "Leads", icon: Users, path: "/leads" },
  { id: "tareas", label: "Tareas", icon: Target, path: "/tareas" },
  { id: "n8n", label: "N8N", icon: Zap, path: "/n8n" },
  {
    id: "maquinas-virtuales",
    label: "Máquinas Virtuales",
    icon: Cloud,
    path: "/maquinas-virtuales",
  },
  {
    id: "seguridad",
    label: "Seguridad y Alertas",
    icon: Shield,
    path: "/seguridad",
  },
  // { id: "reportes", label: "Reportes", icon: BarChart3, path: "/reportes" },
  // {
  //   id: "configuracion",
  //   label: "Configuración",
  //   icon: Settings,
  //   path: "/configuracion",
  // },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {

    // Usar authService para logout
    authService.logout();
    // Redirigir al login
    navigate("/login");
  };

  return (
    <div
      className={`bg-[#0F172A] h-screen transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-slate-700">
        {!collapsed && (
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg flex items-center justify-center">
                <img src={logoColor} alt="Logo" className="h-10" />
              </div>
              <span className="text-white font-semibold text-xl p-2">
                ElPatrón
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Tu negocio, bajo control
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-green-600 text-white border-r-4 border-green-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        {/*Log out button hover red, same witdh other buttons and style*/}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-red-500 transition-colors rounded mb-2"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">Cerrar Sesión</span>
            )}
          </button>
        </div>

        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {!collapsed && (
            <span className="text-slate-400 text-xs">Sistema Seguro</span>
          )}
        </div>
      </div>
    </div>
  );
}
