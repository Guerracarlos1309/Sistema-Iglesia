import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import styles from './Members.module.css';

const initialMembers = [
  { id: 1, name: 'Ana Gómez', email: 'anag@example.com', phone: '+1 234 567 8900', group: 'Célula Norte', role: 'Líder', status: 'Activo' },
  { id: 2, name: 'Carlos Guerra', email: 'carlos@example.com', phone: '+1 234 567 8901', group: 'Célula Centro', role: 'Pastor', status: 'Activo' },
  { id: 3, name: 'María Rodríguez', email: 'mariar@example.com', phone: '+1 234 567 8902', group: 'Célula Sur', role: 'Miembro', status: 'Inactivo' },
];

export function Members() {
  const { addToast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', group: '', role: 'Miembro', status: 'Activo'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData(member);
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', group: '', role: 'Miembro', status: 'Activo' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
      addToast('Integrante actualizado correctamente');
    } else {
      setMembers([...members, { ...formData, id: Date.now() }]);
      addToast('Integrante registrado correctamente');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setMembers(members.filter(m => m.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast('Integrante eliminado con éxito', 'info');
    }
  };

  return (
    <div className={styles.membersPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Directorio de Integrantes</h1>
          <p className="page-subtitle">Gestiona la información y roles de la congregación</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Nuevo Integrante
        </Button>
      </header>

      <div className={styles.searchFilters}>
        <div style={{ flex: 1 }}>
          <Input 
            icon={Search} 
            placeholder="Buscar por nombre, correo o teléfono..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary">
          <Filter size={18} />
          Filtros
        </Button>
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Contacto</TableHeader>
            <TableHeader>Célula / Grupo</TableHeader>
            <TableHeader>Rol</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader align="right">Acciones</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div style={{ fontWeight: 500 }}>{member.name}</div>
              </TableCell>
              <TableCell>
                <div style={{ color: 'var(--text-secondary)' }}>{member.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.phone}</div>
              </TableCell>
              <TableCell>{member.group}</TableCell>
              <TableCell>
                <span className={styles.roleBadge}>{member.role}</span>
              </TableCell>
              <TableCell>
                <span className={`${styles.statusBadge} ${member.status === 'Activo' ? styles.statusActive : styles.statusInactive}`}>
                  {member.status}
                </span>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="sm" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(member)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(member.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredMembers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No se encontraron integrantes que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableContainer>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Integrante"
        message="¿Estás seguro de que deseas eliminar este integrante? Esta acción no se puede deshacer."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Integrante' : 'Nuevo Integrante'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>Guardar Integrante</Button>
          </>
        }
      >
        <form id="member-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <Input label="Grupo o Célula" name="group" value={formData.group} onChange={handleChange} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Rol</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ 
                width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
              }}>
                <option value="Miembro">Miembro</option>
                <option value="Líder">Líder</option>
                <option value="Diácono">Diácono</option>
                <option value="Pastor">Pastor</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ 
                width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
              }}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
