import React, { useState } from 'react';
import { Plus, Calendar, Search, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import styles from './Meetings.module.css';

const initialMeetings = [
  { id: 1, date: '2026-10-26', name: 'Servicio Dominical', group: 'Congregación General', attendance: '145', status: 'Completado' },
  { id: 2, date: '2026-10-28', name: 'Noche de Oración', group: 'Congregación General', attendance: '80', status: 'Agendado' }
];

export function Meetings() {
  const { addToast } = useToast();
  const [meetings, setMeetings] = useState(initialMeetings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState({
    date: '', name: '', group: '', attendance: '', status: 'Agendado'
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMeetings = meetings.filter(meeting => 
    meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setFormData({ date: '', name: '', group: 'Congregación General', attendance: '', status: 'Agendado' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMeetings([{ ...formData, id: Date.now() }, ...meetings]);
    addToast('Reunión registrada con éxito');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setMeetings(meetings.filter(m => m.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast('Reunión eliminada', 'info');
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Reuniones</h1>
          <p className="page-subtitle">Control de servicios, asistencia y eventos</p>
        </div>
        <Button variant="primary" onClick={handleOpenModal}>
          <Plus size={18} />
          Registrar Reunión
        </Button>
      </header>

      <div style={{ maxWidth: '400px' }}>
        <Input 
          icon={Search} 
          placeholder="Buscar por fecha, nombre o tipo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Nombre/Tema</TableHeader>
            <TableHeader>Grupo/Célula</TableHeader>
            <TableHeader>Asistencia</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader align="right">Acción</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {filteredMeetings.map(m => (
            <TableRow key={m.id}>
              <TableCell>{m.date}</TableCell>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.group}</TableCell>
              <TableCell>
                <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{m.attendance}</span>
              </TableCell>
              <TableCell>
                <span style={{ 
                  background: m.status === 'Completado' ? 'var(--success-bg)' : 'var(--warning-bg)', 
                  color: m.status === 'Completado' ? 'var(--success)' : 'var(--warning)', 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' 
                }}>
                  {m.status}
                </span>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(m.id)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredMeetings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No se encontraron reuniones que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
          {meetings.length === 0 && (
             <TableRow>
             <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
               No hay reuniones registradas.
             </TableCell>
           </TableRow>
          )}
        </TableBody>
      </TableContainer>

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
        title="Registrar Nueva Reunión/Servicio"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>Guardar Registro</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Nombre o Tema del Servicio" name="name" value={formData.name} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Fecha" type="date" name="date" value={formData.date} onChange={handleChange} required />
            <Input label="Grupo o Célula" name="group" value={formData.group} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Número de Asistentes" type="number" name="attendance" value={formData.attendance} onChange={handleChange} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ 
                width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
              }}>
                <option value="Agendado">Agendado</option>
                <option value="Completado">Completado</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
