import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        {/* Espacio para breadcrumbs si se requiere */}
      </div>
      <div className={styles.rightSection}>
        <Button variant="ghost" size="sm" style={{ borderRadius: 'var(--radius-full)' }}>
          <Bell size={20} />
        </Button>
        <div className={styles.profileInfo}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Carlos Guerra</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
          <div className={styles.avatar}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
