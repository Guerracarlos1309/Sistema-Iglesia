import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit2, Trash2, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import { helpFetch, ENDPOINTS } from '../../utils/helpFetch';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import styles from './Announcements.module.css';

export function Announcements() {
  const { isAdmin } = useAuth();
  const { get, post, put, del } = helpFetch();
  const { addToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    image_url: '',
    status: 'published'
  });

  const fetchData = async () => {
    try {
      const [ads, cats] = await Promise.all([
        isAdmin ? get(ENDPOINTS.ANNOUNCEMENTS.ADMIN) : get(ENDPOINTS.ANNOUNCEMENTS.LIST),
        get(ENDPOINTS.LOOKUPS.ANNOUNCEMENT_CATEGORIES)
      ]);
      setAnnouncements(ads);
      setCategories(cats);
      if (cats.length > 0 && !editingId) {
        setFormData(prev => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (err) {
      addToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(ENDPOINTS.ANNOUNCEMENTS.ITEM(editingId), formData);
        addToast('Anuncio actualizado');
      } else {
        await post(ENDPOINTS.ANNOUNCEMENTS.CREATE, formData);
        addToast('Anuncio creado');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      addToast('Error al guardar', 'error');
    }
  };

  const handleEdit = (ad) => {
    setFormData({
      title: ad.title,
      content: ad.content,
      category_id: ad.category_id,
      image_url: ad.image_url || '',
      status: ad.status
    });
    setEditingId(ad.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este anuncio?')) {
      try {
        await del(ENDPOINTS.ANNOUNCEMENTS.ITEM(id));
        addToast('Anuncio eliminado');
        fetchData();
      } catch (err) {
        addToast('Error al eliminar', 'error');
      }
    }
  };

  if (loading) return <div className="loading-spinner">Cargando anuncios...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="page-title">Tablón de Anuncios</h1>
          <p className="page-subtitle">Comunicaciones institucionales y noticias</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditingId(null); setFormData({ title: '', content: '', category_id: categories[0]?.id, image_url: '', status: 'published' }); setShowModal(true); }}>
            <Plus size={18} /> Nuevo Anuncio
          </Button>
        )}
      </header>

      <div className={styles.grid}>
        {announcements.map((ad) => (
          <Card key={ad.id} className={`${styles.card} ${ad.status === 'draft' ? styles.draft : ''}`}>
            {ad.image_url && (
              <div className={styles.imageWrapper}>
                <img src={ad.image_url} alt={ad.title} className={styles.image} />
              </div>
            )}
            <CardContent className={styles.content}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>
                  <Tag size={12} /> {categories.find(c => c.id === ad.category_id)?.name || 'General'}
                </span>
                {isAdmin && <span className={styles.statusBadge}>{ad.status === 'published' ? 'Publicado' : 'Borrador'}</span>}
              </div>
              <h3 className={styles.title}>{ad.title}</h3>
              <p className={styles.description}>{ad.content}</p>
              
              <div className={styles.footer}>
                <div className={styles.date}>
                  <Calendar size={14} /> {new Date(ad.created_at).toLocaleDateString()}
                </div>
                {isAdmin && (
                  <div className={styles.actions}>
                    <button onClick={() => handleEdit(ad)} className={styles.actionBtn} title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(ad.id)} className={`${styles.actionBtn} ${styles.delete}`} title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Anuncio' : 'Nuevo Anuncio'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Título</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className={styles.formGroup}>
            <label>Categoría</label>
            <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>URL de Imagen</label>
            <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label>Contenido</label>
            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required rows="4" />
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit">Guardar Anuncio</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
