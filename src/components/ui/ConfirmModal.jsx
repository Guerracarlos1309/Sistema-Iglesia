import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción", 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar", 
  isDanger = true,
  isLoading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
          <Button 
            variant={isDanger ? 'danger' : 'primary'} 
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
        <div style={{ 
          width: '48px', height: '48px', borderRadius: '12px', 
          backgroundColor: isDanger ? 'var(--danger-bg)' : 'var(--accent-glow)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDanger ? 'var(--danger)' : 'var(--accent-primary)',
          flexShrink: 0
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '4px' }}>
            ¿Estás seguro?
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
