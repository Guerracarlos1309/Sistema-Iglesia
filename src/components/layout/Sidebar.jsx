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
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useLayout } from "./AppLayout";
import styles from "./Sidebar.module.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Integrantes", path: "/integrantes" },
  { icon: Network, label: "Grupos", path: "/grupos" },
  { icon: Calendar, label: "Reuniones", path: "/reuniones" },
  { icon: MapPin, label: "Sedes", path: "/sedes" },
  { icon: Activity, label: "Finanzas", path: "/finanzas" },
  { icon: ChartNetwork, label: "Reportes", path: "/reportes" },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();

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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(styles.navLink, isActive && styles.active)
            }
          >
            <item.icon className={styles.navIcon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
