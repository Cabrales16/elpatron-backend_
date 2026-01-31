#!/bin/bash

# ============================================================================
# EL PATRÓN - Startup Script
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 EL PATRÓN - Sistema de Control Operativo Enterprise"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if MySQL is running
echo "🔍 Verificando MySQL..."
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL no está ejecutándose"
    echo "   Inicia MySQL antes de continuar:"
    echo "   sudo systemctl start mysql"
    exit 1
fi
echo "✅ MySQL está activo"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "❌ Archivo backend/.env no encontrado"
    echo "   Copia backend/.env.example a backend/.env"
    echo "   y configura las variables de entorno"
    exit 1
fi
echo "✅ Configuración encontrada"
echo ""

# Ask if user wants to seed database
read -p "¿Quieres poblar la base de datos con datos de prueba? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌱 Ejecutando seed..."
    cd backend
    npm run db:seed
    cd ..
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ Iniciando servicios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend in background
echo "🔌 Iniciando Backend (Puerto 3000)..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   PID: $BACKEND_PID"
echo ""

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "🎨 Iniciando Frontend (Puerto 5173)..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
echo ""

sleep 2

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sistema iniciado correctamente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend:  http://localhost:5173"
echo "🔌 Backend:   http://localhost:3000"
echo "💾 Database:  MySQL (el_patron)"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🔑 Credenciales de prueba:"
echo "   Admin:    admin@elpatron.com / admin123"
echo "   Operador: operator@elpatron.com / operator123"
echo ""
echo "⛔ Para detener: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Save PIDs to file for easy cleanup
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids

echo "Presiona Ctrl+C para detener todos los servicios..."

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Deteniendo servicios...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm .pids; echo '✅ Servicios detenidos'; exit 0" SIGINT SIGTERM

# Keep script running
wait
