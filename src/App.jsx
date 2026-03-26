import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Members } from "./pages/Members/Members";
import { Groups } from "./pages/Groups/Groups";
import { Finances } from "./pages/Finances/Finances";
import { Meetings } from "./pages/Meetings/Meetings";
import { Locations } from "./pages/Locations/Locations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/integrantes" element={<Members />} />
          <Route path="/grupos" element={<Groups />} />
          <Route path="/reuniones" element={<Meetings />} />
          <Route path="/sedes" element={<Locations />} />
          <Route path="/finanzas" element={<Finances />} />
          <Route
            path="/configuracion"
            element={
              <div className="flex-center" style={{ height: "100%" }}>
                <h2>Configuración del Sistema</h2>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
