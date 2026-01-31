import { Shield, AlertTriangle, CheckCircle, Lock } from "lucide-react";

// ============================================================================
// STATUS CHIP - Muestra estados curados del sistema
// ============================================================================

interface StatusChipProps {
  status: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  // Operations
  NEW: { label: "Nueva", color: "blue", icon: null },
  VALIDATED: { label: "Validada", color: "green", icon: CheckCircle },
  IN_PROGRESS: { label: "En Ejecución", color: "purple", icon: null },
  RESTRICTED: { label: "Controlada", color: "orange", icon: Lock },
  BLOCKED: { label: "Bloqueada", color: "red", icon: AlertTriangle },
  COMPLETED: { label: "Completada", color: "green", icon: CheckCircle },
  CANCELLED: { label: "Cancelada", color: "gray", icon: null },

  // Leads
  NUEVO: { label: "Nuevo", color: "blue", icon: null },
  CONTACTADO: { label: "Contactado", color: "yellow", icon: null },
  CALIFICADO: { label: "Calificado", color: "green", icon: CheckCircle },
  CONVERTIDO: { label: "Convertido", color: "green", icon: CheckCircle },
  PERDIDO: { label: "Perdido", color: "red", icon: null },

  // Tasks
  POR_HACER: { label: "Por Hacer", color: "gray", icon: null },
  EN_PROGRESO: { label: "En Progreso", color: "blue", icon: null },
  EN_REVISION: { label: "En Revisión", color: "yellow", icon: null },
  BLOQUEADA: { label: "Bloqueada", color: "red", icon: Lock },
  COMPLETADA: { label: "Completada", color: "green", icon: CheckCircle },

  // VMs
  ACTIVA: { label: "Activa", color: "green", icon: CheckCircle },
  DETENIDA: { label: "Detenida", color: "gray", icon: null },
  MANTENIMIENTO: { label: "Mantenimiento", color: "yellow", icon: null },
  ERROR: { label: "Error", color: "red", icon: AlertTriangle },
  PROVISIONANDO: { label: "Provisionando", color: "blue", icon: null },

  // Security
  CRITICO: { label: "Crítico", color: "red", icon: AlertTriangle },
  ADVERTENCIA: { label: "Advertencia", color: "yellow", icon: AlertTriangle },
  INFO: { label: "Info", color: "blue", icon: null },
  EXITO: { label: "Éxito", color: "green", icon: CheckCircle },

  // Governance
  ACTIVE: { label: "Activo", color: "green", icon: Shield },
  SUSPENDED: { label: "Suspendido", color: "red", icon: Lock },
  CONTROLLED: { label: "Controlado", color: "green", icon: Shield },
};

const colorClasses = {
  green: "bg-green-100 text-green-700 border-green-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-700 border-red-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  gray: "bg-slate-100 text-slate-700 border-slate-200",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function StatusChip({ status, label, size = "md" }: StatusChipProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: "gray",
    icon: null,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colorClasses[config.color as keyof typeof colorClasses]} ${sizeClasses[size]}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label || config.label}
    </span>
  );
}

// ============================================================================
// CONTEXT BADGE - Muestra contexto de riesgo/gobierno
// ============================================================================

interface ContextBadgeProps {
  type: "risk" | "confidence" | "governance";
  value: number | string;
  label?: string;
}

export function ContextBadge({ type, value, label }: ContextBadgeProps) {
  if (type === "risk") {
    const numValue = typeof value === "number" ? value : parseFloat(value);
    const riskLevel =
      numValue >= 75 ? "high" : numValue >= 50 ? "medium" : "low";

    const colors = {
      low: "bg-green-50 text-green-700 border-green-200",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      high: "bg-red-50 text-red-700 border-red-200",
    };

    const labels = {
      low: "Riesgo Bajo",
      medium: "Riesgo Medio",
      high: "Riesgo Alto",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[riskLevel]}`}
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">
          {label || labels[riskLevel]}
        </span>
      </div>
    );
  }

  if (type === "confidence") {
    const numValue = typeof value === "number" ? value : parseFloat(value);
    const confidenceLevel =
      numValue >= 80 ? "high" : numValue >= 50 ? "medium" : "low";

    const colors = {
      low: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      high: "bg-green-50 text-green-700 border-green-200",
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[confidenceLevel]}`}
      >
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {label || `Confianza ${numValue}%`}
        </span>
      </div>
    );
  }

  if (type === "governance") {
    const governanceColors = {
      CONTROLLED: "bg-green-50 text-green-700 border-green-200",
      RESTRICTED: "bg-orange-50 text-orange-700 border-orange-200",
      PERMISSIVE: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const color =
      governanceColors[value as keyof typeof governanceColors] ||
      "bg-slate-50 text-slate-700 border-slate-200";

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color}`}
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">{label || value}</span>
      </div>
    );
  }

  return null;
}

// ============================================================================
// SYSTEM DECISION - Muestra decisiones automáticas del sistema
// ============================================================================

interface SystemDecisionProps {
  type: "APPROVED" | "BLOCKED" | "REQUIRES_VALIDATION" | "AUTOMATED";
  title: string;
  message: string;
  policy?: string;
  timestamp?: string;
}

export function SystemDecision({
  type,
  title,
  message,
  policy,
  timestamp,
}: SystemDecisionProps) {
  const config = {
    APPROVED: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    BLOCKED: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
    REQUIRES_VALIDATION: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-900",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
    },
    AUTOMATED: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      icon: Shield,
      iconColor: "text-blue-600",
    },
  };

  const {
    bgColor,
    borderColor,
    textColor,
    icon: Icon,
    iconColor,
  } = config[type];

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${textColor} mb-1`}>{title}</h4>
          <p className={`text-sm ${textColor} opacity-90`}>{message}</p>
          {policy && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-mono bg-white bg-opacity-60 px-2 py-0.5 rounded border border-current border-opacity-20">
                {policy}
              </span>
            </div>
          )}
          {timestamp && <p className="text-xs opacity-60 mt-2">{timestamp}</p>}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// GOVERNANCE INDICATOR - Indicador de nivel de gobierno
// ============================================================================

interface GovernanceIndicatorProps {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  label?: string;
}

export function GovernanceIndicator({
  level,
  label,
}: GovernanceIndicatorProps) {
  const config = {
    LOW: { color: "green", bars: 1, label: "Gobierno Permisivo" },
    MEDIUM: { color: "yellow", bars: 2, label: "Gobierno Moderado" },
    HIGH: { color: "orange", bars: 3, label: "Gobierno Estricto" },
    CRITICAL: { color: "red", bars: 4, label: "Gobierno Crítico" },
  };

  const { color, bars, label: defaultLabel } = config[level];

  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 h-6 rounded-full ${
              i <= bars
                ? colorClasses[color as keyof typeof colorClasses]
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-slate-700">
        {label || defaultLabel}
      </span>
    </div>
  );
}
