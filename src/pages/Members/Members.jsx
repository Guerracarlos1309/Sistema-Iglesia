import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, Award, CheckCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MembersKanban } from './MembersKanban';
import { MembersLeaders } from './MembersLeaders';
import styles from './Members.module.css';

const mockGroups = [
  { id: 1, name: 'Célula Norte' },
  { id: 2, name: 'Célula Sur' },
  { id: 3, name: 'Célula Centro' },
  { id: 4, name: 'Ministerio Alabanza' }
];

const initialMembers = [
  { id: 1, name: 'Ana Gómez', email: 'anag@example.com', phone: '+1 234 567 8900', group: 'Célula Norte', role: 'Líder', status: 'Activo' },
  { id: 2, name: 'Carlos Guerra', email: 'carlos@example.com', phone: '+1 234 567 8901', group: 'Célula Centro', role: 'Pastor', status: 'Activo' },
  { id: 3, name: 'María Rodríguez', email: 'mariar@example.com', phone: '+1 234 567 8902', group: 'Célula Sur', role: 'Miembro', status: 'Inactivo' },
];

export function Members() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', group: '', role: 'Miembro', status: 'Activo'
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const filterRole = searchParams.get('role');
  const filterType = searchParams.get('filter');

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    
    if (filterRole && member.role.toLowerCase() !== filterRole.toLowerCase()) return false;
    if (filterType === 'nuevos' && member.role !== 'Nuevo Creyente') return false; // Ajustado según tu lógica

    return true;
  });

  const handleOpenModal = (member = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (member) {
      setEditingId(member.id);
      setFormData(member);
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', group: 'Célula Norte', role: 'Miembro', status: 'Activo' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "group" && value === "new_redirect") {
      navigate('/grupos');
      return;
    }
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
        {isAdmin && (
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Nuevo Integrante
          </Button>
        )}
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

      {filterType === 'nuevos' ? (
        <MembersKanban />
      ) : filterRole === 'lider' || filterRole === 'Líder' ? (
        <MembersLeaders />
      ) : (
        <TableContainer>
          <TableHead>
            <tr>
              <TableHeader>Nombre</TableHeader>
              <TableHeader>Contacto</TableHeader>
              <TableHeader>Célula / Grupo</TableHeader>
              <TableHeader>Rol</TableHeader>
              <TableHeader>Estado</TableHeader>
              {isAdmin && <TableHeader align="right">Acciones</TableHeader>}
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
                {isAdmin && (
                  <TableCell style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" style={{ padding: '0.4rem', color: 'var(--accent-primary)' }} onClick={() => handleOpenModal(member, true)}>
                        <Eye size={16} />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="sm" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(member)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(member.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No se encontraron integrantes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableContainer>
      )}

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
        title={isViewMode ? 'Perfil de Integrante' : editingId ? 'Editar Integrante' : 'Nuevo Integrante'}
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>
              {isViewMode ? 'Cerrar' : 'Cancelar'}
            </Button>
            {!isViewMode && (
              <Button variant="primary" onClick={handleSubmit}>
                Guardar Integrante
              </Button>
            )}
          </>
        }
      >
        {isViewMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {formData.name.charAt(0)}
                </div>
                <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formData.name}</h3>
                   <p style={{ color: 'var(--text-secondary)' }}>{formData.role} • {formData.group}</p>
                </div>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto</label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formData.email || 'Sin correo'}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formData.phone || 'Sin teléfono'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado del Proceso</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                     <CheckCircle size={14} color="var(--success)" />
                     <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Bautizado</span>
                  </div>
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Award size={16} color="var(--warning)" />Logros y Crecimiento
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                   <span style={{ border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Escuela de Líderes I</span>
                   <span style={{ border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Encuentro 2025</span>
                </div>
             </div>
          </div>
        ) : (
          <form id="member-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Correo Electrónico" type="email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Grupo o Célula</label>
            <select name="group" value={formData.group} onChange={handleChange} style={{ 
              width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
            }}>
              <option value="" disabled>Seleccione un grupo...</option>
              {mockGroups.map(group => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
              <option value="new_redirect" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                + Crear Nuevo Grupo (Ir al Módulo)
              </option>
            </select>
          </div>

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
        )}
      </Modal>
    </div>
  );
}
