import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Award, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  User, 
  RotateCcw,
  Users
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { helpFetch, ENDPOINTS } from '../../utils/helpFetch';
import styles from './Members.module.css';

export function Members() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { get, post, put, del } = helpFetch();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDeleted, setViewDeleted] = useState(false);
  
  // Lookup data
  const [lookups, setLookups] = useState({
    statuses: [],
    growthSteps: [],
    locations: [],
    genders: [],
    maritalStatuses: []
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    gender_id: 1,
    marital_status_id: 1,
    conversion_date: '',
    baptism_date: '',
    status_id: 1,
    growth_step_id: 1,
    location_id: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `${ENDPOINTS.MEMBERS.BASE}${viewDeleted ? '?deleted=true' : ''}`;
      const [membersData, statuses, growthSteps, locations, genders, maritalStatuses] = await Promise.all([
        get(endpoint),
        get(ENDPOINTS.LOOKUPS.MEMBER_STATUSES),
        get(ENDPOINTS.LOOKUPS.GROWTH_STEPS),
        get(ENDPOINTS.LOCATIONS.BASE),
        get(ENDPOINTS.LOOKUPS.GENDERS),
        get(ENDPOINTS.LOOKUPS.MARITAL_STATUSES)
      ]);
      setMembers(membersData);
      setLookups({ statuses, growthSteps, locations, genders, maritalStatuses });
    } catch (err) {
      addToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewDeleted]);

  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (member.phone && member.phone.includes(searchTerm));
  });

  const handleOpenModal = (member = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (member) {
      setEditingId(member.id);
      setFormData({
        ...member,
        birth_date: member.birth_date ? member.birth_date.split('T')[0] : '',
        conversion_date: member.conversion_date ? member.conversion_date.split('T')[0] : '',
        baptism_date: member.baptism_date ? member.baptism_date.split('T')[0] : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        first_name: '', last_name: '', email: '', phone: '', address: '',
        birth_date: '', gender_id: lookups.genders[0]?.id || 1, 
        marital_status_id: lookups.maritalStatuses[0]?.id || 1,
        conversion_date: '', baptism_date: '', status_id: 1, growth_step_id: 1,
        location_id: lookups.locations[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(ENDPOINTS.MEMBERS.ITEM(editingId), formData);
        addToast('Integrante actualizado');
      } else {
        await post(ENDPOINTS.MEMBERS.BASE, formData);
        addToast('Integrante registrado');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      addToast('Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas archivar este integrante?')) {
      try {
        await del(ENDPOINTS.MEMBERS.ITEM(id));
        addToast('Integrante archivado');
        fetchData();
      } catch (err) {
        addToast('Error al archivar', 'error');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await post(`${ENDPOINTS.MEMBERS.ITEM(id)}/restore`);
      addToast('Integrante restaurado');
      fetchData();
    } catch (err) {
      addToast('Error al restaurar', 'error');
    }
  };

  if (loading && members.length === 0) return <div className="loading-spinner">Sincronizando directorio...</div>;

  return (
    <div className={styles.membersPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Directorio de Integrantes</h1>
          <p className="page-subtitle">Gestión centralizada de la congregación y relaciones familiares</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAdmin && (
            <Button 
               variant={viewDeleted ? "secondary" : "ghost"} 
               onClick={() => setViewDeleted(!viewDeleted)}
            >
               {viewDeleted ? "Ver Miembros Activos" : "Ver Papelera"}
            </Button>
          )}
          {isAdmin && (
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Nuevo Integrante
            </Button>
          )}
        </div>
      </header>

      <div className={styles.searchFilters}>
        <div style={{ flex: 1 }}>
          <Input icon={Search} placeholder="Buscar por nombre, correo o teléfono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="secondary"><Filter size={18} /> Filtros</Button>
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>Nombre Completo</TableHeader>
            <TableHeader>Contacto</TableHeader>
            <TableHeader>Crecimiento</TableHeader>
            <TableHeader>Estado</TableHeader>
            {isAdmin && <TableHeader align="right">Acciones</TableHeader>}
          </tr>
        </TableHead>
        <TableBody>
          {filteredMembers.map((member) => {
            const gender = lookups.genders.find(g => g.id === member.gender_id)?.name || 'N/A';
            const marital = lookups.maritalStatuses.find(m => m.id === member.marital_status_id)?.name || 'N/A';
            
            return (
              <TableRow key={member.id} className={member.deleted_at ? styles.deletedRow : ''}>
                <TableCell>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.first_name} {member.last_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gender} • {marital}</div>
                </TableCell>
                <TableCell>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{member.email || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.phone || '—'}</div>
                </TableCell>
                <TableCell>
                  <span className={styles.growthBadge}>
                    {lookups.growthSteps.find(s => s.id === member.growth_step_id)?.name || 'Nuevo'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`${styles.statusBadge} ${member.status_id === 1 ? styles.statusActive : styles.statusInactive}`}>
                    {lookups.statuses.find(s => s.id === member.status_id)?.name || 'Dato'}
                  </span>
                </TableCell>
                {isAdmin && (
                  <TableCell style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      {!member.deleted_at ? (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(member, true)}><Eye size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(member)}><Edit2 size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} style={{ color: 'var(--status-danger)' }}><Trash2 size={16} /></Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleRestore(member.id)} className={styles.restoreBtn}><RotateCcw size={16} /> Restaurar</Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isViewMode ? 'Perfil Detallado' : editingId ? 'Editar Integrante' : 'Nuevo Integrante'}
      >
        {isViewMode ? (
          <div className={styles.viewDetails}>
            <div className={styles.viewHeader}>
               <div className={styles.avatarLarge}>{(formData.first_name?.[0] || '') + (formData.last_name?.[0] || '')}</div>
               <div>
                  <h3>{formData.first_name} {formData.last_name}</h3>
                  <p>{lookups.growthSteps.find(s => s.id === formData.growth_step_id)?.name}</p>
               </div>
            </div>
            <div className={styles.viewGrid}>
               <div className={styles.viewItem}><User size={16}/> <strong>Género:</strong> {lookups.genders.find(g => g.id === formData.gender_id)?.name}</div>
               <div className={styles.viewItem}><Users size={16}/> <strong>Estado Civil:</strong> {lookups.maritalStatuses.find(m => m.id === formData.marital_status_id)?.name}</div>
               <div className={styles.viewItem}><Calendar size={16}/> <strong>Nacimiento:</strong> {formData.birth_date || 'No registrado'}</div>
               <div className={styles.viewItem}><MapPin size={16}/> <strong>Dirección:</strong> {formData.address || 'No registrada'}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.inputGroupTwo}>
              <Input label="Nombres" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
              <Input label="Apellidos" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
            </div>
            <div className={styles.inputGroupTwo} style={{ marginTop: '1rem' }}>
              <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <Input label="Teléfono" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className={styles.inputGroupThree} style={{ marginTop: '1rem' }}>
              <div className={styles.selectGroup}>
                <label>Género</label>
                <select value={formData.gender_id} onChange={e => setFormData({...formData, gender_id: parseInt(e.target.value)})}>
                  {lookups.genders.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className={styles.selectGroup}>
                <label>Estado Civil</label>
                <select value={formData.marital_status_id} onChange={e => setFormData({...formData, marital_status_id: parseInt(e.target.value)})}>
                  {lookups.maritalStatuses.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <Input label="Fecha Nacimiento" type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} />
            </div>
            
            <div className={styles.sectionHeader}>
              <h4>Datos Eclesiásticos</h4>
              <div className={styles.inputGroupTwo}>
                 <div className={styles.selectGroup}>
                    <label>Proceso Crecimiento</label>
                    <select value={formData.growth_step_id} onChange={e => setFormData({...formData, growth_step_id: parseInt(e.target.value)})}>
                       {lookups.growthSteps.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
                 <div className={styles.selectGroup}>
                    <label>Estatus</label>
                    <select value={formData.status_id} onChange={e => setFormData({...formData, status_id: parseInt(e.target.value)})}>
                       {lookups.statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="primary">Guardar Integrante</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
