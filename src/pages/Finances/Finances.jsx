import React, { useState } from 'react';
import { Plus, Download, ArrowUpRight, ArrowDownRight, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';
import styles from './Finances.module.css';

const initialTransactions = [
  { id: 1, trxId: '#TRX-001', date: '2026-10-25', type: 'Ingreso', category: 'Diezmo', amount: '$500.00', status: 'Completado' },
  { id: 2, trxId: '#TRX-002', date: '2026-10-24', type: 'Ingreso', category: 'Ofrenda', amount: '$1,250.00', status: 'Completado' },
  { id: 3, trxId: '#TRX-003', date: '2026-10-22', type: 'Gasto', category: 'Mantenimiento', amount: '$350.00', status: 'Completado' },
  { id: 4, trxId: '#TRX-004', date: '2026-10-20', type: 'Ingreso', category: 'Pro-Templo', amount: '$800.00', status: 'Pendiente' },
];

export function Finances() {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null });
  
  const [formData, setFormData] = useState({
    date: '', type: 'Ingreso', category: 'Diezmo', amount: '', status: 'Completado'
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(trx => 
    trx.trxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setFormData({ date: '', type: 'Ingreso', category: 'Diezmo', amount: '', status: 'Completado' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrx = {
      ...formData,
      id: Date.now(),
      trxId: `#TRX-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: `$${Number(formData.amount).toFixed(2)}`
    };
    setTransactions([newTrx, ...transactions]);
    addToast('Transacción registrada con éxito');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setConfirmConfig({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (confirmConfig.id !== null) {
      setTransactions(transactions.filter(t => t.id !== confirmConfig.id));
      setConfirmConfig({ isOpen: false, id: null });
      addToast('Transacción eliminada', 'info');
    }
  };

  return (
    <div className={styles.financesPage}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Tesorería y Finanzas</h1>
          <p className="page-subtitle">Gestión transparente de ingresos, ofrendas y proyectos</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary">
            <Download size={18} />
            Exportar
          </Button>
          <Button variant="primary" onClick={handleOpenModal}>
            <Plus size={18} />
            Nuevo Registro
          </Button>
        </div>
      </header>

      <div style={{ maxWidth: '400px' }}>
        <Input 
          icon={Search} 
          placeholder="Buscar por ID o categoría..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>ID Transacción</TableHeader>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Categoría</TableHeader>
            <TableHeader>Monto</TableHeader>
            <TableHeader>Estado</TableHeader>
            <TableHeader align="right">Acción</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {filteredTransactions.map((trx) => (
            <TableRow key={trx.id}>
              <TableCell><span style={{ color: 'var(--text-secondary)' }}>{trx.trxId}</span></TableCell>
              <TableCell>{trx.date}</TableCell>
              <TableCell>{trx.category}</TableCell>
              <TableCell>
                <div className={`${styles.transactionType} ${trx.type === 'Ingreso' ? styles.income : styles.expense}`}>
                  {trx.type === 'Ingreso' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{trx.type === 'Ingreso' ? '+' : '-'}{trx.amount}</span>
                </div>
              </TableCell>
              <TableCell>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: trx.status === 'Completado' ? 'var(--success)' : 'var(--warning)', 
                  background: trx.status === 'Completado' ? 'var(--success-bg)' : 'var(--warning-bg)', 
                  padding: '4px 10px', 
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  {trx.status}
                </span>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(trx.id)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredTransactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No se encontraron transacciones que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          )}
          {transactions.length === 0 && (
             <TableRow>
             <TableCell colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
               No hay transacciones registradas.
             </TableCell>
           </TableRow>
          )}
        </TableBody>
      </TableContainer>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Transacción"
        message="¿Estás seguro de que deseas eliminar permanentemente este registro financiero?"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registrar Transacción"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>Guardar Transacción</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Tipo de Movimiento</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ 
                width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
              }}>
                <option value="Ingreso">Ingreso</option>
                <option value="Gasto">Gasto</option>
              </select>
            </div>
            <Input label="Monto" type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <Input label="Categoría o Concepto" name="category" value={formData.category} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Fecha" type="date" name="date" value={formData.date} onChange={handleChange} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange} style={{ 
                width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none'
              }}>
                <option value="Completado">Completado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
