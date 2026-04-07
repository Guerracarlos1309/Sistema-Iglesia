import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Network,
  Calendar,
  MapPin,
  Activity,
  Church,
  ChartNetwork,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useLayout } from "./AppLayout";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { 
    icon: Users, 
    label: "Integrantes", 
    path: "/integrantes",
    subItems: [
      { label: "Ver Directorio", path: "/integrantes" },
      { label: "Nuevos Creyentes", path: "/integrantes?filter=nuevos" },
      { label: "Líderes", path: "/integrantes?role=lider" }
    ]
  },
  { 
    icon: Network, 
    label: "Grupos", 
    path: "/grupos",
    subItems: [
      { label: "Células Activas", path: "/grupos" },
      { label: "Ministerios", path: "/grupos?type=ministerio" },
      { label: "Mapa de Grupos", path: "/grupos?view=map" }
    ]
  },
  { 
    icon: Calendar, 
    label: "Reuniones", 
    path: "/reuniones",
    subItems: [
      { label: "Calendario", path: "/reuniones" },
      { label: "Historial de Servicios", path: "/reuniones?history=true" }
    ]
  },
  { 
    icon: MapPin, 
    label: "Sedes", 
    path: "/sedes", 
    adminOnly: true,
    subItems: [
      { label: "Ver todas", path: "/sedes" },
      { label: "Sede Central", path: "/sedes?q=central" },
      { label: "Mapa General", path: "/sedes?view=map" }
    ]
  },
  { 
    icon: Activity, 
    label: "Finanzas", 
    path: "/finanzas", 
    adminOnly: true,
    subItems: [
      { label: "Dashboard General", path: "/finanzas" },
      { label: "Ingresos", path: "/finanzas?type=ingreso" },
      { label: "Egresos", path: "/finanzas?type=egreso" }
    ]
  },
  { 
    icon: ChartNetwork, 
    label: "Reportes", 
    path: "/reportes", 
    adminOnly: true,
    subItems: [
      { label: "Reportes Recientes", path: "/reportes" },
      { label: "Reporte Mensual", path: "/reportes?view=mensual" },
      { label: "Crecimiento Semanal", path: "/reportes?view=crecimiento" }
    ]
  },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const { isAdmin } = useAuth();
  const [expandedMenus, setExpandedMenus] = React.useState({});

  const toggleSubMenu = (label) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={cn(styles.sidebar, isSidebarOpen && styles.open)}>
      <div className={styles.logoContainer}>
        <Church size={28} color="var(--accent-primary)" />
        <span className={styles.logoText}>Church System</span>
        <button className={styles.closeButton} onClick={closeSidebar}>
          <X size={20} />
        </button>
      </div>
      <nav className={styles.nav}>
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              <div 
                className={cn(styles.navLink, expandedMenus[item.label] && styles.active)}
                onClick={() => toggleSubMenu(item.label)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <item.icon className={styles.navIcon} />
                  {item.label}
                </div>
                {expandedMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(styles.navLink, isActive && styles.active)
                }
              >
                <item.icon className={styles.navIcon} />
                {item.label}
              </NavLink>
            )}

            {item.subItems && expandedMenus[item.label] && (
              <div style={{ paddingLeft: '2.5rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {item.subItems.map(sub => (
                  <NavLink
                    key={sub.label}
                    to={sub.path}
                    className={({ isActive }) =>
                      cn(styles.navLink, isActive && styles.active, styles.subNavLink)
                    }
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
