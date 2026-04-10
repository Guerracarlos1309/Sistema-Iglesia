import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Search, Edit2, Trash2, Phone, Mail, Users, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { helpFetch, ENDPOINTS } from '../../utils/helpFetch';
import { MapComponent } from '../../components/ui/MapComponent';
import styles from './Locations.module.css';

export function Locations() {
  const { addToast } = useToast();
  const { isAdmin } = useAuth();
  const { get, post, put, del } = helpFetch();
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '', address: '', city: '', country: '',
    latitude: 8.9819, longitude: -79.5193,
    phone: '', email: '', capacity: 0, status: 'operativo'
  });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await get(ENDPOINTS.LOCATIONS.BASE);
      setLocations(data);
    } catch (err) {
      addToast('Error al cargar sedes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(ENDPOINTS.LOCATIONS.ITEM(editingId), formData);
        addToast('Sede actualizada');
      } else {
        await post(ENDPOINTS.LOCATIONS.BASE, formData);
        addToast('Sede creada');
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      addToast('Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta sede?')) {
      try {
        await del(ENDPOINTS.LOCATIONS.ITEM(id));
        addToast('Sede eliminada');
        fetchLocations();
      } catch (err) {
        addToast('Error al eliminar', 'error');
      }
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Localizando campus...</div>;

  return (
    <div className={styles.locationsPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Sedes y Campus</h1>
          <p className="page-subtitle">Gestión de infraestructura y centros de reunión</p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Nueva Sede
          </Button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: 'calc(100vh - 250px)' }}>
        <div className={styles.listSection}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Input icon={Search} placeholder="Buscar por nombre o ciudad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <div className={styles.grid}>
            {filteredLocations.map((loc) => (
              <Card key={loc.id} className={styles.locationCard}>
                <CardContent>
                  <div className={styles.cardHeader}>
                    <h3>{loc.name}</h3>
                    <span className={`${styles.status} ${styles[loc.status]}`}>{loc.status}</span>
                  </div>
                  <p className={styles.address}><MapPin size={14}/> {loc.address}, {loc.city}</p>
                  <div className={styles.contactInfo}>
                    <span><Phone size={14}/> {loc.phone || 'N/A'}</span>
                    <span><Mail size={14}/> {loc.email || 'N/A'}</span>
                    <span><Users size={14}/> Cap: {loc.capacity}</span>
                  </div>
                  {isAdmin && (
                    <div className={styles.actions}>
                      <Button variant="ghost" size="sm" onClick={() => { setFormData(loc); setEditingId(loc.id); setIsModalOpen(true); }}><Edit2 size={16}/></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(loc.id)} style={{ color: 'var(--status-danger)' }}><Trash2 size={16}/></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className={styles.mapSection}>
          <MapComponent 
            markers={filteredLocations.map(l => ({
              position: [parseFloat(l.latitude), parseFloat(l.longitude)],
              title: l.name,
              description: l.address
            }))}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={editingId ? 'Editar Sede' : 'Nueva Sede'}
        >
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Nombre de la Sede" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <Input label="Ciudad" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
               <Input label="País" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
            </div>
            <Input label="Dirección Física" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <Input label="Latitud" type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
               <Input label="Longitud" type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <Input label="Teléfono" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
               <Input label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <Input label="Capacidad Máxima" type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
               <div className={styles.selectGroup}>
                  <label>Estado</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                     <option value="operativo">Operativo</option>
                     <option value="mantenimiento">Mantenimiento</option>
                     <option value="inactivo">Inactivo</option>
                  </select>
               </div>
            </div>
            <div className={styles.modalActions}>
               <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
               <Button type="submit">Guardar Campus</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
