import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import Login from "./app/components/Login.tsx";
import "./firebase";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Componente protegido para rutas autenticadas
import { authService } from "./app/services/auth";

function ProtectedRoute() {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <App /> : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedRoute />} />
    </Routes>
  </Router>,
);
