import React, { useState } from "react";
import { Plus, Calendar, Search, Trash2, Eye, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useToast } from "../../components/ui/Toast";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MeetingsCalendar } from "./MeetingsCalendar";
import styles from "./Meetings.module.css";

const mockLocations = [
  { id: 1, name: "Sede Central" },
  { id: 2, name: "Sede Tariba" },
  { id: 3, name: "Sede Cordero" }
];

const initialMeetings = [
  {
    id: 1,
    date: "2026-10-26",
    name: "Servicio Dominical",
    group: "Congregación General",
    attendance: "145",
    newVisitors: "12",
    offering: "$850.00",
    status: "Completado",
  },
  {
    id: 2,
    date: "2026-10-28",
    name: "Noche de Oración",
    group: "Congregación General",
    attendance: "80",
    newVisitors: "0",
    offering: "-",
    status: "Agendado",
  },
];

export function Meetings() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(initialMeetings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    id: null,
  });

  const [formData, setFormData] = useState({
    date: "",
    name: "",
    group: "",
    location: "",
    attendance: "",
    newVisitors: "",
    offering: "",
    status: "Agendado",
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const filterHistory = searchParams.get('history') === 'true';

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMeetings = meetings.filter(
    (meeting) => {
      const matchesSearch = meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            meeting.group.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (filterHistory && meeting.status !== "Completado") return false;
      return true;
    }
  );

  const handleOpenModal = (meeting = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (meeting) {
      setEditingId(meeting.id);
      setFormData(meeting);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        date: "",
        time: "",
        type: "Servicio Dominical",
        location: "Sede Central",
        description: "",
        attendance: 0,
        offerings: 0,
        visitors: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "location" && value === "new_redirect") {
      navigate('/sedes');
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMeetings([{ ...formData, id: Date.now() }, ...meetings]);
    addToast("Reunión registrada con éxito");
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setMeetings(meetings.filter((m) => m.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast("Reunión eliminada", "info");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Reuniones</h1>
          <p className="page-subtitle">
            Control de servicios, asistencia y eventos
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Registrar Reunión
        </Button>
      </header>

      <div style={{ maxWidth: "400px" }}>
        <Input
          icon={Search}
          placeholder="Buscar por fecha, nombre o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!filterHistory ? (
        <MeetingsCalendar />
      ) : (
        <>
        <h3 className="page-subtitle" style={{ margin: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>Log Analítico de Servicios Pasados</h3>
        <TableContainer>
          <TableHead>
            <tr>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Tema Predicado</TableHeader>
              <TableHeader>Asistencia Total</TableHeader>
              <TableHeader>Nuevos Visitantes</TableHeader>
              <TableHeader>Ofrenda Recogida</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader align="right">Acción</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {filteredMeetings.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.date}</TableCell>
                <TableCell style={{ fontWeight: 500 }}>{m.name}</TableCell>
                <TableCell>
                  <span style={{ fontWeight: 600, color: "var(--accent-primary)" }}>
                    {m.attendance}
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                    +{m.newVisitors}
                  </span>
                </TableCell>
                <TableCell>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.offering || '-'}</span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      background:
                        m.status === "Completado"
                          ? "var(--success-bg)"
                          : "var(--warning-bg)",
                      color:
                        m.status === "Completado"
                          ? "var(--success)"
                          : "var(--warning)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {m.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" size="sm" style={{ padding: '0.4rem', color: 'var(--accent-primary)' }} onClick={() => handleOpenModal(m, true)}>
                       <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ padding: '0.4rem', color: 'var(--danger)' }}
                      onClick={() => handleDelete(m.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMeetings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No se encontraron registros que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContainer>
        </>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Reunión"
        message="¿Estás seguro de que deseas eliminar este registro de reunión?"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isViewMode ? `Analítica: ${formData.name}` : editingId ? "Editar Reunión" : "Nueva Reunión"}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button variant="primary" onClick={handleSubmit}>
                Guardar Reunión
              </Button>
            )}
          </>
        }
      >
        {isViewMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                   <Users size={18} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                   <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.attendance || 120}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Asistencia</span>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                   <TrendingUp size={18} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
                   <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.newVisitors || 12}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visitantes</span>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                   <DollarSign size={18} color="var(--warning)" style={{ marginBottom: '0.5rem' }} />
                   <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{formData.offering || '$350'}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ofrenda</span>
                </div>
             </div>

             <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { name: 'Esperado', val: 150 },
                     { name: 'Real', val: parseInt(formData.attendance) || 120 }
                   ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Bar dataKey="val" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>

             <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Observaciones del Servicio</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                   No se registraron observaciones adicionales para este servicio.
                </p>
             </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
          <Input
            label="Nombre o Tema del Servicio"
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
            <Input
              label="Fecha"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <Input
              label="Grupo o Célula"
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
            />
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
              Lugar / Sede de la Reunión
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
              <option value="" disabled>Seleccione una sede...</option>
              {mockLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
              <option value="new_redirect" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                + Crear Nueva Sede (Ir al Módulo)
              </option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input
              label="Número de Asistentes"
              type="number"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              required
            />
            <Input
              label="Visitantes Nuevos"
              type="number"
              name="newVisitors"
              value={formData.newVisitors}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input
              label="Ofrenda Recogida ($)"
              type="text"
              name="offering"
              placeholder="Ej. 150.00"
              value={formData.offering}
              onChange={handleChange}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.625rem 1rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", outline: "none" }}
              >
                <option value="Agendado">Agendado</option>
                <option value="Completado">Completado</option>
              </select>
            </div>
          </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
