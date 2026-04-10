import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Network, 
  MapPin, 
  Search, 
  Trash2, 
  Eye, 
  Users, 
  Globe, 
  Clock, 
  Calendar, 
  Edit2, 
  RotateCcw 
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { helpFetch, ENDPOINTS } from "../../utils/helpFetch";
import { MapComponent } from "../../components/ui/MapComponent";
import styles from "./Groups.module.css";

export function Groups() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { get, post, put, del } = helpFetch();
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDeleted, setViewDeleted] = useState(false);
  
  // Lookups and related data
  const [lookups, setLookups] = useState({
    groupTypes: [],
    members: [],
    locations: []
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    group_type_id: "",
    latitude: 8.9819,
    longitude: -79.5193,
    address: "",
    schedule_day: "Domingo",
    schedule_time: "18:00:00",
    leader_id: "",
    co_leader_id: "",
    location_id: "",
    active: true,
    capacity_limit: 20
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const viewMode = searchParams.get("view");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `${ENDPOINTS.GROUPS.BASE}${viewDeleted ? '?deleted=true' : ''}`;
      const [groupsData, types, members, locations] = await Promise.all([
        get(endpoint),
        get(ENDPOINTS.LOOKUPS.GROUP_TYPES),
        get(ENDPOINTS.MEMBERS.BASE),
        get(ENDPOINTS.LOCATIONS.BASE)
      ]);
      setGroups(groupsData);
      setLookups({ groupTypes: types, members, locations });
    } catch (err) {
      addToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewDeleted]);

  const filteredGroups = groups.filter((group) => {
    return group.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenModal = (group = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (group) {
      setEditingId(group.id);
      setFormData(group);
    } else {
      setEditingId(null);
      setFormData({
        name: "", description: "", group_type_id: lookups.groupTypes[0]?.id || "",
        latitude: 8.9819, longitude: -79.5193, address: "",
        schedule_day: "Domingo", schedule_time: "18:00:00",
        leader_id: "", co_leader_id: "", location_id: lookups.locations[0]?.id || "",
        active: true, capacity_limit: 20
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(ENDPOINTS.GROUPS.ITEM(editingId), formData);
        addToast("Grupo actualizado");
      } else {
        await post(ENDPOINTS.GROUPS.BASE, formData);
        addToast("Grupo creado");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      addToast("Error al guardar", "error");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("¿Archivar este grupo?")) {
      try {
        await del(ENDPOINTS.GROUPS.ITEM(id));
        addToast("Grupo archivado");
        fetchData();
      } catch (err) {
        addToast("Error al archivar", "error");
      }
    }
  };

  const handleRestore = async (id, e) => {
    e.stopPropagation();
    try {
      await post(`${ENDPOINTS.GROUPS.ITEM(id)}/restore`);
      addToast("Grupo restaurado");
      fetchData();
    } catch (err) {
      addToast("Error al restaurar", "error");
    }
  };

  if (loading && groups.length === 0) return <div className="loading-spinner">Mapeando red de grupos...</div>;

  return (
    <div className={styles.groupsPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Grupos Bíblicos</h1>
          <p className="page-subtitle">Gestión territorial y discipulado dinámico</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {isAdmin && (
             <Button variant={viewDeleted ? "secondary" : "ghost"} onClick={() => setViewDeleted(!viewDeleted)}>
                {viewDeleted ? "Activos" : "Papelera"}
             </Button>
           )}
           <Button variant={viewMode === 'map' ? 'primary' : 'outline'} onClick={() => navigate('/grupos?view=map')}>
              <Globe size={18} /> Ver Mapa
           </Button>
           {isAdmin && (
             <Button variant="primary" onClick={() => handleOpenModal()}>
               <Plus size={18} /> Nuevo Grupo
             </Button>
           )}
        </div>
      </header>

      <div style={{ maxWidth: "400px", marginBottom: '1.5rem' }}>
        <Input icon={Search} placeholder="Buscar grupo por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {viewMode === "map" ? (
        <div style={{ height: '600px' }}>
          <MapComponent 
            markers={filteredGroups.map(g => ({
              position: [parseFloat(g.latitude), parseFloat(g.longitude)],
              title: g.name,
              description: g.address
            }))}
          />
        </div>
      ) : (
        <div className={styles.groupsGrid}>
          {filteredGroups.map((group) => (
            <Card key={group.id} className={cn(styles.groupCard, group.deleted_at && styles.deletedCard)} onClick={() => handleOpenModal(group, true)}>
              <CardContent>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.groupTitle}>{group.name}</h3>
                    <div className={styles.groupSubtitle}>
                      {lookups.groupTypes.find(t => t.id === group.group_type_id)?.name}
                    </div>
                  </div>
                  <div className={styles.groupIcon}><Network size={24} /></div>
                </div>
                <div className={styles.locationRow}>
                   <MapPin size={14} /> {group.address || 'Ubicación remota'}
                </div>
                <div className={styles.scheduleRow}>
                   <Calendar size={14} /> {group.schedule_day} • <Clock size={14} /> {group.schedule_time}
                </div>
                <div className={styles.statsRow}>
                   <div className={styles.stat}>
                      <span className={styles.statValue}>{group.capacity_limit}</span>
                      <span className={styles.statLabel}>Capacidad</span>
                   </div>
                   <div className={styles.stat}>
                      <span className={cn(styles.statValue, group.active ? styles.active : styles.inactive)}>
                         {group.active ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className={styles.statLabel}>Estado</span>
                   </div>
                </div>
                {isAdmin && (
                  <div className={styles.actions} style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {!group.deleted_at ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(group); }}><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="sm" onClick={(e) => handleDelete(group.id, e)} style={{ color: 'var(--status-danger)' }}><Trash2 size={16} /></Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={(e) => handleRestore(group.id, e)} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                        <RotateCcw size={16} /> Restaurar
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isViewMode ? `Detalles: ${formData.name}` : editingId ? "Editar Grupo" : "Nuevo Grupo"}
      >
        {isViewMode ? (
          <div className={styles.viewDetails}>
             <div className={styles.mapContainer}>
                <MapComponent 
                  center={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
                  zoom={15}
                  markers={[{ position: [parseFloat(formData.latitude), parseFloat(formData.longitude)], title: formData.name }]}
                />
             </div>
             <div className={styles.viewInfo}>
                <p><strong>Descripción:</strong> {formData.description || 'Sin descripción'}</p>
                <p><strong>Líder:</strong> {lookups.members.find(m => m.id === formData.leader_id)?.first_name || 'No asignado'}</p>
                <p><strong>Dirección:</strong> {formData.address}</p>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Nombre del Grupo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <div className={styles.formGrid}>
               <div className={styles.selectGroup}>
                  <label>Tipo de Grupo</label>
                  <select value={formData.group_type_id} onChange={e => setFormData({...formData, group_type_id: parseInt(e.target.value)})}>
                     {lookups.groupTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>
               <div className={styles.selectGroup}>
                  <label>Sede / Campus</label>
                  <select value={formData.location_id} onChange={e => setFormData({...formData, location_id: parseInt(e.target.value)})}>
                     {lookups.locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
               </div>
            </div>
            <div className={styles.formGrid}>
               <div className={styles.selectGroup}>
                  <label>Día de Reunión</label>
                  <select value={formData.schedule_day} onChange={e => setFormData({...formData, schedule_day: e.target.value})}>
                     {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
               </div>
               <Input label="Hora" type="time" value={formData.schedule_time} onChange={e => setFormData({...formData, schedule_time: e.target.value})} />
            </div>
            <Input label="Dirección exacta" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <div className={styles.modalActions}>
               <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
               <Button type="submit">Guardar Grupo</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

