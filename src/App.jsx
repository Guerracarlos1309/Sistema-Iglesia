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
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/integrantes" element={<Members />} />
            <Route path="/grupos" element={<Groups />} />
            <Route path="/reuniones" element={<Meetings />} />
            <Route path="/sedes" element={<Locations />} />
            <Route path="/finanzas" element={<Finances />} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/configuracion" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
