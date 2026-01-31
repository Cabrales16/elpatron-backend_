import {
  User,
  Bell,
  Lock,
  Globe,
  Database,
  Mail,
  Palette,
  Shield,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

export function ConfigPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600 mt-1">
          Administración del sistema y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium">
                <User className="w-4 h-4" />
                <span className="text-sm">Perfil</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notificaciones</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Seguridad</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Globe className="w-4 h-4" />
                <span className="text-sm">API & Integraciones</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Database className="w-4 h-4" />
                <span className="text-sm">Base de Datos</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg">
                <Palette className="w-4 h-4" />
                <span className="text-sm">Apariencia</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Información del Perfil
              </h2>
              <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-100">
                    Cambiar foto
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    JPG, PNG. Max 5MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    defaultValue="Carlos"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    defaultValue="Mendoza"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="carlos.mendoza@empresa.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rol
                </label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Administrador</option>
                  <option>Usuario</option>
                  <option>Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  defaultValue="+34 612 345 678"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Zona Horaria
                </label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Europa/Madrid (GMT+1)</option>
                  <option>Europa/Londres (GMT+0)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Asia/Tokyo (GMT+9)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Seguridad
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Autenticación de dos factores (MFA)
                    </p>
                    <p className="text-sm text-slate-600">
                      Protección adicional para tu cuenta
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Cambiar contraseña
                    </p>
                    <p className="text-sm text-slate-600">
                      Última actualización: hace 3 meses
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-100">
                  Cambiar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      Notificaciones de seguridad
                    </p>
                    <p className="text-sm text-slate-600">
                      Alertas sobre actividad sospechosa
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  API Keys
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Gestiona las claves de API para integraciones
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nueva API Key
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 mb-1">
                    Production API Key
                  </p>
                  <code className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    sk_prod_••••••••••••••••••••1234
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    Creada el 15 Ene 2026 · Último uso: hace 2 horas
                  </p>
                </div>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 mb-1">
                    Development API Key
                  </p>
                  <code className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    sk_dev_••••••••••••••••••••5678
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    Creada el 10 Ene 2026 · Último uso: hace 1 día
                  </p>
                </div>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Integraciones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900">N8N Workflows</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Conectado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Automatización de procesos
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Configurar →
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900">Slack</h3>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                    Desconectado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Notificaciones en tiempo real
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Conectar →
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900">
                    Microsoft Teams
                  </h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Conectado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Comunicación del equipo
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Configurar →
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900">Salesforce</h3>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                    Desconectado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Sincronización de CRM
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Conectar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
