#!/bin/bash

# ============================================================================
# EL PATRÓN - Stop Script
# ============================================================================

echo "🛑 Deteniendo El Patrón..."

if [ -f ".pids" ]; then
    while read pid; do
        kill $pid 2>/dev/null && echo "✅ Proceso $pid detenido"
    done < .pids
    rm .pids
    echo "✅ Todos los servicios detenidos"
else
    echo "ℹ️  No hay procesos activos (archivo .pids no encontrado)"
fi

# Clean log files
rm -f backend.log frontend.log 2>/dev/null

echo "🧹 Logs limpiados"
echo "✨ Listo"
