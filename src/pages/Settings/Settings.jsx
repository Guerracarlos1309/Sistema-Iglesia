import React, { useState } from "react";
import {
  Building2,
  Palette,
  Lock,
  Globe,
  Bell,
  ShieldCheck,
  Save,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import styles from "./Settings.module.css";

export function Settings() {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", label: "Información General", icon: Building2 },

    { id: "security", label: "Seguridad", icon: Lock },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "system", label: "Sistema y Red", icon: Globe },
  ];

  return (
    <div className={styles.settingsPage}>
      <header className={styles.header}>
        <h1 className="page-title">Configuración del Sistema</h1>
        <p className="page-subtitle">
          Personaliza y gestiona los parámetros globales de ChurchSystem
        </p>
      </header>

      <div className={styles.layout}>
        {/* Sidebar de Configuración */}
        <aside className={styles.sidebar}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.activeNavItem : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon size={20} />
              <span>{section.label}</span>
              <ChevronRight size={16} className={styles.arrow} />
            </button>
          ))}
        </aside>

        {/* Contenido Principal */}
        <main className={styles.content}>
          <Card className="glass-panel">
            <CardHeader className={styles.cardHeader}>
              <CardTitle>
                {sections.find((s) => s.id === activeSection)?.label}
              </CardTitle>
              <Button variant="primary" size="sm" className={styles.saveBtn}>
                <Save size={16} />
                Guardar Cambios
              </Button>
            </CardHeader>
            <CardContent>
              {activeSection === "general" && (
                <div className={styles.formSection}>
                  <div className={styles.logoUpload}>
                    <div className={styles.logoPreview}>
                      <Building2 size={40} />
                    </div>
                    <div className={styles.logoInfo}>
                      <h3>Logo de la Iglesia</h3>
                      <p>PNG o JPG, máximo 2MB.</p>
                      <Button variant="ghost" size="sm">
                        Subir Nueva Foto
                      </Button>
                    </div>
                  </div>

                  <div className={styles.grid}>
                    <Input
                      label="Nombre de la Iglesia"
                      defaultValue="Iglesia Central"
                    />
                    <Input
                      label="Slogan / Lema"
                      defaultValue="Un lugar para conectar"
                    />
                    <Input
                      label="Teléfono de Contacto"
                      defaultValue="+1 234 567 890"
                    />
                    <Input
                      label="Correo Electrónico Principal"
                      defaultValue="contacto@iglesia.com"
                    />
                  </div>
                  <div style={{ marginTop: "1.25rem" }}>
                    <Input
                      label="Dirección Principal"
                      defaultValue="Calle de la Fe #123, Ciudad"
                    />
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className={styles.formSection}>
                  <div style={{ marginBottom: "2rem" }}>
                    <h3 className={styles.subTitle}>Acceso y Seguridad</h3>
                    <p className={styles.sectionDesc}>
                      Controla las políticas de acceso del personal.
                    </p>
                  </div>
                  <div className={styles.grid}>
                    <div className={styles.toggleCard}>
                      <div>
                        <span className={styles.toggleLabel}>
                          Autenticación en dos pasos
                        </span>
                        <p className={styles.toggleDesc}>
                          Añade una capa extra de seguridad.
                        </p>
                      </div>
                      <div className={styles.switch}></div>
                    </div>
                    <div className={styles.toggleCard}>
                      <div>
                        <span className={styles.toggleLabel}>
                          Sesiones Activas
                        </span>
                        <p className={styles.toggleDesc}>
                          Ver dónde has iniciado sesión.
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Gestionar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className={styles.emptyState}>
                  <Bell size={48} />
                  <p>
                    Configura las alertas por correo y notificaciones push del
                    sistema.
                  </p>
                </div>
              )}

              {activeSection === "system" && (
                <div className={styles.emptyState}>
                  <Globe size={48} />
                  <p>
                    Ajustes de servidor, base de datos e integraciones externas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
