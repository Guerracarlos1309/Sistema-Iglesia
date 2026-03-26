import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Network,
  Calendar,
  MapPin,
  Activity,
  Settings,
  Church,
} from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./Sidebar.module.css";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Integrantes", path: "/integrantes" },
  { icon: Network, label: "Grupos", path: "/grupos" },
  { icon: Calendar, label: "Reuniones", path: "/reuniones" },
  { icon: MapPin, label: "Sedes", path: "/sedes" },
  { icon: Activity, label: "Finanzas", path: "/finanzas" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Church size={28} color="var(--accent-primary)" />
        <span className={styles.logoText}>Church System</span>
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
