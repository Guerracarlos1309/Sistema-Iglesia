import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Members } from "./pages/Members/Members";
import { Groups } from "./pages/Groups/Groups";
import { Finances } from "./pages/Finances/Finances";
import { Meetings } from "./pages/Meetings/Meetings";
import { Locations } from "./pages/Locations/Locations";
import { Reports } from "./pages/Reports/Reports";
import { Login } from "./pages/Login/Login";
import { Settings } from "./pages/Settings/Settings";
import { Users as UsersPage } from "./pages/Users/Users";
import { Announcements } from "./pages/Announcements/Announcements";
import { ToastProvider } from "./components/ui/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/integrantes" element={<Members />} />
              <Route path="/grupos" element={<Groups />} />
              <Route path="/reuniones" element={<Meetings />} />
              <Route path="/sedes" element={<Locations />} />
              <Route path="/finanzas" element={<Finances />} />
              <Route path="/reportes" element={<Reports />} />
              <Route path="/anuncios" element={<Announcements />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/configuracion" element={<Settings />} />
            </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
