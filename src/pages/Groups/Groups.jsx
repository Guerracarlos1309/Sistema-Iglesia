import React, { useState } from "react";
import { Plus, Network, MapPin, Search, Trash2, Eye, Users } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GroupsMap } from "./GroupsMap";
import { GroupsMinistries } from "./GroupsMinistries";
import styles from "./Groups.module.css";

const mockMembers = [
  { id: 1, name: "Ana Gómez" },
  { id: 2, name: "Marcos Ruiz" },
  { id: 3, name: "Sofía Martínez" },
  { id: 4, name: "Carlos Guerra" },
];

const mockLocations = [
  { id: 1, name: "Sede Central (Barrio Norte)" },
  { id: 2, name: "Sede Tariba (Barrio Sur)" },
  { id: 3, name: "Sede Cordero (Avenida)" },
];

const initialGroups = [
  {
    id: 1,
    name: "Célula Norte Central",
    leader: "Ana Gómez",
    location: "Barrio Norte",
    members: 24,
    type: "Jóvenes",
  },
  {
    id: 2,
    name: "Célula Sur Primavera",
    leader: "Marcos Ruiz",
    location: "Barrio Sur",
    members: 18,
    type: "Familias",
  },
  {
    id: 3,
    name: "Célula Este Renacer",
    leader: "Sofía Martínez",
    location: "Barrio Este",
    members: 32,
    type: "General",
  },
];

export function Groups() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState(initialGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    leader: "",
    location: "",
    members: 0,
    type: "General",
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const filterType = searchParams.get("type");
  const viewMode = searchParams.get("view");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "ministerio" && group.type !== "Ministerio")
      return false; // Ajuste por si quieres ministerio

    return true;
  });

  const handleOpenModal = (loc = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (loc) {
      setEditingId(loc.id);
      setFormData(loc);
    } else {
      setEditingId(null);
      setFormData({ name: "", leader: "", location: "", members: 0, type: "General" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "leader" && value === "new_redirect") {
      navigate("/integrantes");
      return;
    }
    if (name === "location" && value === "new_redirect") {
      navigate("/sedes");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setGroups(
        groups.map((g) =>
          g.id === editingId ? { ...formData, id: editingId } : g,
        ),
      );
      addToast("Grupo actualizado con éxito");
    } else {
      setGroups([...groups, { ...formData, id: Date.now() }]);
      addToast("Grupo creado correctamente");
    }
    handleCloseModal();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setGroups(groups.filter((g) => g.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast("Grupo eliminado", "info");
    }
  };

  return (
    <div className={styles.groupsPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Grupos</h1>
          <p className="page-subtitle">
            Estructura jerárquica y localizaciones del sistema
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nuevo Grupo
          </Button>
        )}
      </header>

      <div style={{ maxWidth: "400px" }}>
        <Input
          icon={Search}
          placeholder="Buscar grupo o líder..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {viewMode === "map" ? (
        <GroupsMap />
      ) : filterType === "ministerio" ? (
        <GroupsMinistries />
      ) : (
        <div className={styles.groupsGrid}>
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className={styles.groupCard}
              onClick={() => handleOpenModal(group)}
            >
              <CardContent>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.groupTitle}>{group.name}</h3>
                    <div className={styles.groupSubtitle}>
                      Líder: {group.leader}
                    </div>
                  </div>
                  <div className={styles.groupIcon}>
                    <Network size={24} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "var(--text-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={14} />
                    {group.location}
                  </div>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ padding: "0.25rem", color: "var(--accent-primary)" }}
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(group, true); }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ padding: "0.25rem", color: "var(--danger)" }}
                        onClick={(e) => handleDelete(group.id, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{group.members}</span>
                    <span className={styles.statLabel}>Miembros</span>
                  </div>
                  <div className={styles.stat}>
                    <span
                      className={styles.statValue}
                      style={{ fontSize: "1rem", marginTop: "0.25rem" }}
                    >
                      <span
                        style={{
                          background: "var(--bg-tertiary)",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {group.type}
                      </span>
                    </span>
                    <span className={styles.statLabel}>Tipo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredGroups.length === 0 && (
            <p style={{ color: "var(--text-muted)", padding: "2rem" }}>
              No se encontraron grupos que coincidan con la búsqueda.
            </p>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Grupo"
        message="¿Estás seguro de que deseas eliminar este grupo? Se perderán todos los datos asociados."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isViewMode ? `Detalles: ${formData.name}` : editingId ? "Editar Grupo" : "Nuevo Grupo"}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button variant="primary" onClick={handleSubmit}>
                Guardar Grupo
              </Button>
            )}
          </>
        }
      >
        {isViewMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{formData.name}</h3>
                 <p style={{ color: 'var(--text-secondary)' }}>Líder: {formData.leader}</p>
               </div>
               <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'block' }}>{formData.members}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Miembros</span>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px' }}>
               <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} /> Integrantes del Grupo
               </h4>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Ana Gómez', 'Marcos Ruiz', 'Lucía Velásquez'].map((name, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                       <span>{name}</span>
                       <span style={{ color: 'var(--text-muted)' }}>{i === 0 ? 'Líder' : 'Miembro'}</span>
                    </li>
                  ))}
               </ul>
            </div>

            <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
               <iframe 
                src="https://maps.google.com/maps?q=San%20Cristobal,Venezuela&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
               />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
          <Input
            label="Nombre del Grupo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                Líder Encargado
              </label>
              <select
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
                required
              >
                <option value="" disabled>
                  Seleccione un líder...
                </option>
                {mockMembers.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
                <option
                  value="new_redirect"
                  style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
                >
                  + Crear Nuevo (Ir a Integrantes)
                </option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                Ubicación / Sede
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
                required
              >
                <option value="" disabled>
                  Seleccione una sede...
                </option>
                {mockLocations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
                <option
                  value="new_redirect"
                  style={{ color: "var(--accent-primary)", fontWeight: "bold" }}
                >
                  + Crear Nueva (Ir a Sedes)
                </option>
              </select>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Input
              label="Número de Miembros"
              type="number"
              name="members"
              value={formData.members}
              onChange={handleChange}
              required
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                Tipo de Grupo
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.625rem 1rem",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              >
                <option value="General">General</option>
                <option value="Jóvenes">Jóvenes</option>
                <option value="Familias">Familias</option>
                <option value="Universitarios">Universitarios</option>
              </select>
            </div>
          </div>
        </form>
        )}
      </Modal>
    </div>
  );
}
