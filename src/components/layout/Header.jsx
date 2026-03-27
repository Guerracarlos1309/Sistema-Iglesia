import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLayout } from './AppLayout';
import styles from './Header.module.css';

export function Header() {
  const { toggleSidebar } = useLayout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // UI redirect for now
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        {/* Espacio para breadcrumbs si se requiere */}
      </div>
      <div className={styles.rightSection}>
        <Button variant="ghost" size="sm" style={{ borderRadius: 'var(--radius-full)' }}>
          <Bell size={20} />
        </Button>
        <div className={styles.profileContainer} ref={dropdownRef}>
          <div 
            className={styles.profileInfo} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.userInfo}>
              <span className={styles.userName}>Carlos Guerra</span>
              <span className={styles.userRole}>Administrador</span>
            </div>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownName}>Carlos Guerra</span>
                <span className={styles.dropdownEmail}>carlos.guerra@iglesia.com</span>
              </div>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={() => { navigate('/configuracion'); setIsDropdownOpen(false); }} style={{ color: 'var(--text-primary)' }}>
                <Settings size={16} />
                Configuración
              </button>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
