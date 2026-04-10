import React, { useState, useEffect } from 'react';
import { Plus, Download, ArrowUpRight, ArrowDownRight, Trash2, Search, Eye, FileText, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useLocation } from 'react-router-dom';
import { helpFetch, ENDPOINTS } from '../../utils/helpFetch';
import { FinancesDashboard } from './FinancesDashboard';
import styles from './Finances.module.css';

export function Finances() {
  const { addToast } = useToast();
  const { get, post, put, del } = helpFetch();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [lookups, setLookups] = useState({
    categories: [],
    methods: []
  });
  
  const [formData, setFormData] = useState({
    transaction_date: '',
    category_id: '',
    payment_method_id: '',
    amount: '',
    description: '',
    is_verified: false
  });

  const locationState = useLocation();
  const searchParams = new URLSearchParams(locationState.search);
  const filterType = searchParams.get('type');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trxs, cats, methods] = await Promise.all([
        get(ENDPOINTS.FINANCES.BASE),
        get(ENDPOINTS.LOOKUPS.TRANSACTION_CATEGORIES),
        get(ENDPOINTS.LOOKUPS.PAYMENT_METHODS)
      ]);
      setTransactions(trxs);
      setLookups({ categories: cats, methods });
      if (cats.length > 0) setFormData(prev => ({ ...prev, category_id: cats[0].id, payment_method_id: methods[0]?.id }));
    } catch (err) {
      addToast('Error al cargar datos financieros', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (trx = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (trx) {
      setEditingId(trx.id);
      setFormData({
        ...trx,
        transaction_date: trx.transaction_date?.split('T')[0] || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        transaction_date: new Date().toISOString().split('T')[0],
        category_id: lookups.categories[0]?.id || '',
        payment_method_id: lookups.methods[0]?.id || '',
        amount: '',
        description: '',
        is_verified: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(ENDPOINTS.FINANCES.ITEM(editingId), formData);
        addToast('Transacción actualizada');
      } else {
        await post(ENDPOINTS.FINANCES.BASE, formData);
        addToast('Transacción registrada');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      addToast('Error al procesar transacción', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar permanentemente este registro?')) {
      try {
        await del(ENDPOINTS.FINANCES.ITEM(id));
        addToast('Registro eliminado');
        fetchData();
      } catch (err) {
        addToast('Error al eliminar', 'error');
      }
    }
  };

  const filteredTransactions = transactions.filter(trx => {
    const categoryName = lookups.categories.find(c => c.id === trx.category_id)?.name || '';
    return categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (trx.description && trx.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading) return <div className="loading-spinner">Auditanzo finanzas...</div>;

  return (
    <div className={styles.financesPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Tesorería y Finanzas</h1>
          <p className="page-subtitle">Gestión transparente de ingresos y egresos normalizados</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary"><Download size={18} /> Exportar</Button>
          <Button variant="primary" onClick={() => handleOpenModal()}><Plus size={18} /> Nuevo Registro</Button>
        </div>
      </header>

      {!filterType ? (
        <FinancesDashboard transactions={transactions} categories={lookups.categories} />
      ) : (
        <>
        <div style={{ maxWidth: '400px', marginTop: '1.5rem' }}>
          <Input icon={Search} placeholder={`Buscar en ${filterType}s...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <TableContainer>
          <TableHead>
            <tr>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Categoría</TableHeader>
              <TableHeader>Monto</TableHeader>
              <TableHeader>Método</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader align="right">Acción</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((trx) => {
              const cat = lookups.categories.find(c => c.id === trx.category_id);
              return (
                <TableRow key={trx.id}>
                  <TableCell>{new Date(trx.transaction_date).toLocaleDateString()}</TableCell>
                  <TableCell>{cat?.name || 'S/C'}</TableCell>
                  <TableCell>
                    <div className={`${styles.transactionType} ${cat?.type === 'ingreso' ? styles.income : styles.expense}`}>
                      {cat?.type === 'ingreso' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{cat?.type === 'ingreso' ? '+' : '-'}${parseFloat(trx.amount).toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{lookups.methods.find(m => m.id === trx.payment_method_id)?.name}</TableCell>
                  <TableCell>
                    <span className={`${styles.status} ${trx.is_verified ? styles.verified : styles.pending}`}>
                      {trx.is_verified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(trx, true)}><Eye size={16} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(trx.id)} style={{ color: 'var(--status-danger)' }}><Trash2 size={16} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableContainer>
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isViewMode ? 'Detalle de Movimiento' : editingId ? 'Editar Registro' : 'Nueva Transacción'}
      >
        {!isViewMode ? (
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.selectGroup}>
                <label>Categoría</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}>
                  {lookups.categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                </select>
              </div>
              <Input label="Monto" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className={styles.selectGroup}>
                <label>Método de Pago</label>
                <select value={formData.payment_method_id} onChange={e => setFormData({...formData, payment_method_id: parseInt(e.target.value)})}>
                  {lookups.methods.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <Input label="Fecha" type="date" value={formData.transaction_date} onChange={e => setFormData({...formData, transaction_date: e.target.value})} required />
            </div>
            <div style={{ marginTop: '1rem' }}>
               <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Descripción / Concepto</label>
               <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className={styles.textarea}
               />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
               <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
               <Button type="submit">Procesar Registro</Button>
            </div>
          </form>
        ) : (
          <div className={styles.receipt}>
             <div className={styles.receiptHeader}>
                <FileText size={48} color="var(--accent-primary)" />
                <h3>Comprobante de Movimiento</h3>
                <span className={styles.receiptId}>#{formData.id}</span>
             </div>
             <div className={styles.receiptBody}>
                <p><strong>Fecha:</strong> {new Date(formData.transaction_date).toLocaleDateString()}</p>
                <p><strong>Categoría:</strong> {lookups.categories.find(c => c.id === formData.category_id)?.name}</p>
                <p><strong>Método:</strong> {lookups.methods.find(m => m.id === formData.payment_method_id)?.name}</p>
                <p><strong>Descripción:</strong> {formData.description || 'Sin descripción'}</p>
                <div className={styles.totalRow}>
                   <span>Total:</span>
                   <span className={styles.totalAmount}>${parseFloat(formData.amount).toFixed(2)}</span>
                </div>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
