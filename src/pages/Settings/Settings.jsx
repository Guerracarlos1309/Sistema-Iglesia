import React, { useState } from "react";
import {
  Building2,
  Lock,
  Save,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import { helpFetch } from "../../utils/helpFetch";
import styles from "./Settings.module.css";

export function Settings() {
  const { addToast } = useToast();
  const { get, put } = helpFetch();
  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [churchData, setChurchData] = useState({
    name: "",
    slogan: "",
    phone: "",
    email: "",
    address: "",
    logo_url: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const sections = [
    { id: "general", label: "Información General", icon: Building2 },
    { id: "security", label: "Seguridad y Acceso", icon: Lock }
  ];

  // Fetch church info on mount
  React.useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await get("http://localhost:5000/api/church-info");
        setChurchData(data);
      } catch (err) {
        addToast("Error al cargar la información de la iglesia", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleGeneralSave = async () => {
    setIsSaving(true);
    try {
      await put("http://localhost:5000/api/church-info", churchData);
      addToast("Información actualizada correctamente");
    } catch (err) {
      addToast(err.message || "Error al actualizar la información", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return addToast("Las nuevas contraseñas no coinciden", "error");
    }

    if (passwordData.newPassword.length < 8) {
      return addToast("La nueva contraseña debe tener al menos 8 caracteres", "error");
    }

    setIsSaving(true);
    try {
      await put("http://localhost:5000/api/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      addToast("Contraseña actualizada correctamente");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      addToast(err.message || "Error al cambiar la contraseña", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && activeSection === "general") {
    return <div className="loading-spinner">Cargando configuración...</div>;
  }

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
                      value={churchData.name}
                      onChange={(e) => setChurchData({ ...churchData, name: e.target.value })}
                    />
                    <Input
                      label="Slogan / Lema"
                      value={churchData.slogan}
                      onChange={(e) => setChurchData({ ...churchData, slogan: e.target.value })}
                    />
                    <Input
                      label="Teléfono de Contacto"
                      value={churchData.phone}
                      onChange={(e) => setChurchData({ ...churchData, phone: e.target.value })}
                    />
                    <Input
                      label="Correo Electrónico Principal"
                      value={churchData.email}
                      onChange={(e) => setChurchData({ ...churchData, email: e.target.value })}
                    />
                  </div>
                  <div style={{ marginTop: "1.25rem" }}>
                    <Input
                      label="Dirección Principal"
                      value={churchData.address}
                      onChange={(e) => setChurchData({ ...churchData, address: e.target.value })}
                    />
                  </div>
                  <div className={styles.footerActions}>
                    <Button 
                      variant="primary" 
                      className={styles.saveBtn}
                      onClick={handleGeneralSave}
                      isLoading={isSaving}
                    >
                      <Save size={16} />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className={styles.formSection}>
                  <div style={{ marginBottom: "2rem" }}>
                    <h3 className={styles.subTitle}>Cambiar Contraseña</h3>
                    <p className={styles.sectionDesc}>
                      Mantén tu cuenta segura actualizando tu contraseña regularmente.
                    </p>
                  </div>

                  <form onSubmit={handlePasswordChange}>
                    <div className={styles.passwordForm}>
                      <div className={styles.inputWrapper}>
                        <Input
                          label="Contraseña Actual"
                          type="password"
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                      </div>
                      <div className={styles.grid} style={{ marginTop: '1rem' }}>
                        <Input
                          label="Nueva Contraseña"
                          type="password"
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <Input
                          label="Confirmar Nueva Contraseña"
                          type="password"
                          required
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                      
                      <div style={{ marginTop: "2rem" }}>
                        <Button 
                          type="submit" 
                          variant="primary" 
                          isLoading={isSaving}
                        >
                          <RefreshCw size={16} />
                          Actualizar Contraseña
                        </Button>
                      </div>
                    </div>
                  </form>

                  <div className={styles.infoBox} style={{ marginTop: '2.5rem' }}>
                    <ShieldCheck size={20} />
                    <p>La contraseña debe tener al menos 8 caracteres e incluir una combinación de letras y números.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
