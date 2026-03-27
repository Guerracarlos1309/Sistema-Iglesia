import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLayout } from './AppLayout';
import styles from './Header.module.css';

export function Header() {
  const { toggleSidebar } = useLayout();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo Integrante', message: 'María Rodríguez se ha unido a la congregación.', time: 'Hace 5 min', read: false },
    { id: 2, title: 'Reunión Próxima', message: 'La reunión de Jóvenes comienza en 30 minutos.', time: 'Hace 1 hora', read: false },
    { id: 3, title: 'Reporte Mensual', message: 'El reporte de finanzas de Octubre está listo.', time: 'Hace 2 horas', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

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
        <div className={styles.notifContainer} ref={notifRef}>
          <Button 
            variant="ghost" 
            size="sm" 
            style={{ borderRadius: 'var(--radius-full)', position: 'relative' }}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Button>

          {isNotifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span className={styles.dropdownName}>Notificaciones</span>
                <button className={styles.markReadBtn} onClick={markAllRead}>Marcar todo como leído</button>
              </div>
              <div className={styles.dropdownDivider}></div>
              <div className={styles.notifList}>
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}>
                      <div className={styles.notifDot}></div>
                      <div className={styles.notifContent}>
                        <div className={styles.notifTitle}>{n.title}</div>
                        <div className={styles.notifMessage}>{n.message}</div>
                        <div className={styles.notifTime}>{n.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyNotif}>No hay notificaciones nuevas</div>
                )}
              </div>
            </div>
          )}
        </div>

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
