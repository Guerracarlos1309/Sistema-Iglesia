import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isDanger = true }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button 
            variant="primary" 
            style={isDanger ? { backgroundColor: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' } : {}}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
        <div style={{ 
          width: '48px', height: '48px', borderRadius: '50%', 
          backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isDanger ? 'var(--danger)' : 'var(--accent-primary)',
          flexShrink: 0
        }}>
          <AlertTriangle size={24} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}
