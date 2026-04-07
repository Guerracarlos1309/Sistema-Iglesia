import React from "react";
import {
  Users,
  TrendingUp,
  HandCoins,
  HeartPulse,
  ArrowUpRight,
  ArrowDownRight,
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
import styles from "./Dashboard.module.css";

const attendanceData = [
  { week: 'Semana 1', asistencia: 120 },
  { week: 'Semana 2', asistencia: 132 },
  { week: 'Semana 3', asistencia: 145 },
  { week: 'Semana 4', asistencia: 138 },
  { week: 'Semana 5', asistencia: 155 },
  { week: 'Semana 6', asistencia: 168 },
  { week: 'Semana 7', asistencia: 172 },
  { week: 'Semana 8', asistencia: 185 },
];

const groupData = [
  { name: 'C. Norte', asistencia: 45 },
  { name: 'C. Sur', asistencia: 38 },
  { name: 'C. Este', asistencia: 55 },
  { name: 'M. Alabanza', asistencia: 25 },
];

const upcomingEvents = [
  { id: 1, title: 'Servicio Dominical', date: 'Dom, 12 Oct', time: '09:00 AM' },
  { id: 2, title: 'Reunión de Líderes', date: 'Mar, 14 Oct', time: '07:30 PM' },
  { id: 3, title: 'Retiro Jóvenes', date: 'Sáb, 18 Oct', time: '08:00 AM' },
];

const metrics = [
  {
    title: "Miembros Totales",
    value: "1,245",
    trend: "+12% este mes",
    trendType: "up",
    icon: Users,
  },
  {
    title: "Asistencia Promedio",
    value: "89%",
    trend: "+5% vs mes anterior",
    trendType: "up",
    icon: HeartPulse,
  },
  {
    title: "Nuevas Decisiones",
    value: "42",
    trend: "Últimos 30 días",
    trendType: "neutral",
    icon: TrendingUp,
  },
  {
    title: "Balance Financiero",
    value: "$14,500",
    trend: "-2% vs mes anterior",
    trendType: "down",
    icon: HandCoins,
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className={styles.dashboard}>
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visión general</p>
      </header>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <Card key={index} className={styles.metricCard}>
            <CardContent style={{ paddingTop: "1.5rem" }}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>{metric.title}</span>
                <metric.icon size={20} className={styles.metricIcon} />
              </div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div
                className={`${styles.metricTrend} ${
                  metric.trendType === "up"
                    ? styles.trendUp
                    : metric.trendType === "down"
                      ? styles.trendDown
                      : styles.trendNeutral
                }`}
              >
                {metric.trendType === "up" && <ArrowUpRight size={16} />}
                {metric.trendType === "down" && <ArrowDownRight size={16} />}
                {metric.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Asistencia Dominical (Últimas 8 Semanas)</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              height: "300px",
              paddingTop: "1rem"
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--accent-primary)' }}
                />
                <Line type="monotone" dataKey="asistencia" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-primary)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingEvents.map(event => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ background: 'var(--accent-glow)', padding: '0.5rem', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                    <HeartPulse size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{event.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{event.date} • {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              style={{ width: '100%', marginTop: '1rem', color: 'var(--accent-primary)' }}
              onClick={() => navigate('/reuniones')}
            >
              Ver Calendario Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Asistencia por Células / Ministerios</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              height: "250px",
              paddingTop: "1rem"
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="asistencia" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
