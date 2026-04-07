import React, { useState } from "react";
import { Plus, MapPin, Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { SedesMap } from "./SedesMap";
import styles from "./Locations.module.css";

const initialLocations = [
  {
    id: 1,
    name: "Sede Central",
    address: "Av. Principal #123, Ciudad",
    pastor: "Carlos Guerra",
    status: "Activa",
    maps_url: "https://maps.google.com/maps?q=Caracas,Venezuela&t=&z=13&ie=UTF8&iwloc=&output=embed"
  },
  {
    id: 2,
    name: "Sede Tariba",
    address: "Plaza Norte #45, Ciudad",
    pastor: "Miguel Torres",
    status: "Activa",
  },
  {
    id: 3,
    name: "Sede Cordero",
    address: "Avenida Bolivar",
    pastor: "Merly Chacon",
    status: "Activo",
  },
];

export function Locations() {
  const { isAdmin } = useAuth();
  const [locations, setLocations] = useState(initialLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pastor: "",
    status: "Activa",
    maps_url: ""
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const viewMode = searchParams.get('view');
  const queryParam = searchParams.get('q');

  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = locations.filter(
    (loc) => {
      const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loc.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            loc.address.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (queryParam === 'central' && loc.name !== 'Sede Central') return false;
      return true;
    }
  );

  const handleOpenModal = (loc = null) => {
    if (loc) {
      setEditingId(loc.id);
      setFormData(loc);
    } else {
      setEditingId(null);
      setFormData({ name: "", address: "", pastor: "", status: "Activa", maps_url: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setLocations(
        locations.map((l) =>
          l.id === editingId ? { ...formData, id: editingId } : l,
        ),
      );
      addToast("Sede actualizada correctamente");
    } else {
      setLocations([...locations, { ...formData, id: Date.now() }]);
      addToast("Sede registrada correctamente");
    }
    handleCloseModal();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setLocations(locations.filter((l) => l.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast("Sede eliminada con éxito", "info");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Sedes del Estado</h1>
          <p className="page-subtitle">
            Administración de campus y lugares de reunión
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nueva Sede
          </Button>
        )}
      </header>

      <div style={{ maxWidth: "400px" }}>
        <Input
          icon={Search}
          placeholder="Buscar sede..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {viewMode === 'map' ? (
        <SedesMap />
      ) : queryParam === 'central' ? (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card className="glass-panel" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-primary)' }}>
            <CardContent style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Dashboard: Sede Central</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Filtro avanzado para la sede matriz del sistema</p>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal(locations[0])}>Gestionar Sede</Button>
              </div>
            </CardContent>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Card className="glass-panel">
               <CardContent style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Membresía Sede</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>450+</h3>
               </CardContent>
            </Card>
            <Card className="glass-panel">
               <CardContent style={{ padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Impacto en Ofrendas</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>65%</h3>
               </CardContent>
            </Card>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px', border: '1px solid var(--border-color)' }}>
             <iframe 
                src="https://maps.google.com/maps?q=Sede%20Central,Caracas,Venezuela&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
             />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredLocations.map((site) => (
            <Card
              key={site.id}
              style={{ transition: "transform 0.2s", cursor: isAdmin ? "pointer" : "default" }}
              className="hover:transform hover:-translate-y-1 hover:shadow-lg"
              onClick={() => isAdmin && handleOpenModal(site)}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "12px",
                      color: "var(--accent-primary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <MapPin size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        margin: 0,
                        color: "var(--text-primary)",
                      }}
                    >
                      {site.name}
                    </h3>
                    <div style={{ marginTop: "4px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color:
                            site.status === "Activa" || site.status === "Activo"
                              ? "var(--success)"
                              : "var(--danger)",
                          background:
                            site.status === "Activa" || site.status === "Activo"
                              ? "var(--success-bg) "
                              : "var(--danger-bg)",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {site.status}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{ padding: "0.25rem", color: "var(--danger)" }}
                        onClick={(e) => handleDelete(site.id, e)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                <p
                  style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}
                >
                  {site.address}
                </p>
                
                {site.maps_url ? (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', height: '150px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                    <iframe 
                      src={site.maps_url}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                ) : (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', height: '150px', marginBottom: '1rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    Sin ubicación en el mapa
                  </div>
                )}
                <div
                  style={{
                    marginTop: "1.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-color)",
                    fontSize: "0.875rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    Pastor Encargado:
                  </span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {site.pastor}
                  </strong>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredLocations.length === 0 && (
            <p style={{ color: "var(--text-muted)", padding: "2rem" }}>
              No se encontraron sedes que coincidan con la búsqueda.
            </p>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Sede"
        message="¿Estás seguro de que deseas eliminar esta sede del sistema?"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Editar Sede" : "Nueva Sede"}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Guardar Sede
            </Button>
          </>
        }
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <Input
            label="Nombre de la Sede"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Dirección Completa"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            label="URL de Google Maps (Embed)"
            name="maps_url"
            value={formData.maps_url}
            onChange={handleChange}
            placeholder="Ej: https://maps.google.com/maps?q=..."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <Input
              label="Pastor Encargado"
              name="pastor"
              value={formData.pastor}
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
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
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
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
