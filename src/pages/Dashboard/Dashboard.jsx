import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  HandCoins,
  HeartPulse,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Calendar as CalendarIcon,
  MapPin,
  Megaphone
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { helpFetch, ENDPOINTS } from "../../utils/helpFetch";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const { get } = helpFetch();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const statsData = await get(ENDPOINTS.REPORTS.STATS);
          setStats(statsData);
        }
        const adsData = await get(ENDPOINTS.ANNOUNCEMENTS.LIST);
        setAnnouncements(adsData);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) return <div className="loading-spinner">Cargando...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className="page-title">
            {isAdmin ? "Panel Administrativo" : "Bienvenido, " + user?.name}
          </h1>
          <p className="page-subtitle">
            {isAdmin ? "Métricas Críticas y Estadísticas Globales" : "Próximos eventos y noticias importantes"}
          </p>
        </div>
        {!isAdmin && (
          <Button variant="outline" onClick={() => navigate('/sedes')} className={styles.mapButton}>
            <MapPin size={18} /> Ver Sedes Cercanas
          </Button>
        )}
      </header>

      {isAdmin ? (
        <AdminContent stats={stats} navigate={navigate} />
      ) : (
        <UserContent announcements={announcements} navigate={navigate} />
      )}
    </div>
  );
}

function AdminContent({ stats, navigate }) {
  const metrics = [
    { title: "Integrantes", value: stats?.members || "0", icon: Users, color: "var(--accent-primary)" },
    { title: "Grupos Bíblicos", value: stats?.groups || "0", icon: Megaphone, color: "var(--accent-secondary)" },
    { title: "Sedes Activas", value: stats?.locations || "0", icon: MapPin, color: "var(--accent-tertiary)" },
    { title: "Balance Mensual", value: `$${stats?.monthlyFinances?.balance?.toLocaleString() || "0"}`, icon: HandCoins, color: "var(--status-success)" },
  ];

  return (
    <>
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <Card key={index} className={styles.metricCard}>
            <CardContent style={{ paddingTop: "1.5rem" }}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>{metric.title}</span>
                <metric.icon size={20} style={{ color: metric.color }} />
              </div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={14} /> Datos actualizados en tiempo real
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <Card className="glass-panel">
          <CardHeader><CardTitle>Flujo de Caja (Ingresos vs Egresos)</CardTitle></CardHeader>
          <CardContent style={{ height: "300px", minHeight: "300px", width: "100%" }}>
             <ResponsiveContainer width="100%" height="100%" minHeight={300}>
               <BarChart data={[
                 { name: 'Ingresos', total: stats?.monthlyFinances?.ingresos },
                 { name: 'Egresos', total: stats?.monthlyFinances?.egresos }
               ]}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                 <XAxis dataKey="name" fontSize={12} stroke="var(--text-muted)" />
                 <YAxis fontSize={12} stroke="var(--text-muted)" />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                 <Bar dataKey="total" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader><CardTitle>Acciones Rápidas</CardTitle></CardHeader>
          <CardContent className={styles.quickActions}>
            <Button onClick={() => navigate('/reportes')} fullWidth>Generar Balance PDF</Button>
            <Button variant="outline" onClick={() => navigate('/configuracion')} fullWidth>Auditoría de Sistema</Button>
            <Button variant="ghost" onClick={() => navigate('/integrantes')} fullWidth>Gestionar Base de Datos</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function UserContent({ announcements, navigate }) {
  return (
    <div className={styles.userGrid}>
      <div className={styles.mainColumn}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Megaphone size={20} /> Anuncios Recientes</h2>
          </div>
          <div className={styles.announcementsGrid}>
            {announcements.length > 0 ? (
              announcements.map(ad => (
                <Card key={ad.id} className={styles.announcementCard}>
                  {ad.image_url && <img src={ad.image_url} alt={ad.title} className={styles.adImage} />}
                  <CardContent>
                    <span className={styles.adCategory}>{ad.category}</span>
                    <h3 className={styles.adTitle}>{ad.title}</h3>
                    <p className={styles.adContent}>{ad.content}</p>
                    <div className={styles.adFooter}>
                      <span className={styles.adDate}>{new Date(ad.published_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className={styles.noData}>No hay anuncios publicados en este momento.</p>
            )}
          </div>
        </section>
      </div>

      <div className={styles.sideColumn}>
        <Card className="glass-panel">
          <CardHeader><CardTitle><CalendarIcon size={18} /> Próximas Actividades</CardTitle></CardHeader>
          <CardContent>
             <div className={styles.activityList}>
               <div className={styles.activityItem}>
                 <div className={styles.activityDot} />
                 <div>
                   <p className={styles.activityName}>Servicio Dominical</p>
                   <p className={styles.activityTime}>Mañana, 09:00 AM</p>
                 </div>
               </div>
               <div className={styles.activityItem}>
                 <div className={styles.activityDot} />
                 <div>
                   <p className={styles.activityName}>Reunión de Grupo</p>
                   <p className={styles.activityTime}>Miércoles, 07:00 PM</p>
                 </div>
               </div>
             </div>
             <Button variant="ghost" onClick={() => navigate('/reuniones')} style={{ width: '100%', marginTop: '1rem' }}>
               Ver Calendario Completo
             </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel" style={{ marginTop: '1.5rem' }}>
          <CardHeader><CardTitle><Users size={18} /> Participación en Grupos</CardTitle></CardHeader>
          <CardContent>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tienes una reunión pendiente de confirmación.</p>
            <Button size="sm" onClick={() => navigate('/reuniones?confirm=true')}>Confirmar Asistencia</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
