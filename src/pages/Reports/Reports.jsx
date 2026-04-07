import React from 'react';
import { 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { 
  TableContainer, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableHeader, 
  TableCell 
} from "../../components/ui/Table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/Card";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { useLocation } from "react-router-dom";
import { useToast } from "../../components/ui/Toast";
import styles from "./Reports.module.css";

const growthData = [
  { week: 'Sem 1', retencion: 45, nuevos: 60 },
  { week: 'Sem 2', retencion: 52, nuevos: 55 },
  { week: 'Sem 3', retencion: 48, nuevos: 70 },
  { week: 'Sem 4', retencion: 61, nuevos: 65 },
];

const monthlyConsolidated = [
  { name: 'Membresía', valor: 85, fill: 'var(--accent-primary)' },
  { name: 'Asistencia', valor: 92, fill: 'var(--success)' },
  { name: 'Finanzas', valor: 78, fill: 'var(--warning)' },
  { name: 'Grupos', valor: 88, fill: 'var(--accent-secondary)' },
];

const summaryData = [
  {
    id: 1,
    title: "Ingresos Mensuales",
    value: "$12,450",
    change: "+15% vs mes anterior",
    icon: DollarSign,
    trend: "up",
  },
  {
    id: 2,
    title: "Nuevos Miembros",
    value: "45",
    change: "+5% vs mes anterior",
    icon: Users,
    trend: "up",
  },
  {
    id: 3,
    title: "Asistencia Promedio",
    value: "320",
    change: "+12% vs mes anterior",
    icon: Calendar,
    trend: "up",
  },
  {
    id: 4,
    title: "Grupos Activos",
    value: "24",
    change: "Últimos 30 días",
    icon: TrendingUp,
    trend: "neutral",
  },
];

const recentReports = [
  {
    id: 101,
    name: "Reporte Financiero Mensual",
    type: "Finanzas",
    date: "2026-10-31",
    status: "Generado",
  },
  {
    id: 102,
    name: "Crecimiento de Membresía Q3",
    type: "Membresía",
    date: "2026-10-15",
    status: "Generado",
  },
  {
    id: 103,
    name: "Asistencia por Células",
    type: "Grupos",
    date: "2026-10-10",
    status: "Generado",
  },
  {
    id: 104,
    name: "Balance Anual Proyectado",
    type: "Finanzas",
    date: "2026-10-01",
    status: "Generado",
  },
];

export function Reports() {
  const { addToast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewMode = searchParams.get('view');

  const handleDownload = (name = "Reporte") => {
    addToast(`Generando ${name}...`, 'info');
    setTimeout(() => {
      addToast(`${name} descargado correctamente`, 'success');
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Reportes y Analíticas</h1>
          <p className="page-subtitle">
            Visualiza el estado general y exporta datos clave
          </p>
        </div>
        <div className={styles.actionsGroup}>
          <Button variant="outline">
            <Filter size={18} />
            Filtros
          </Button>
          <Button variant="primary" onClick={() => handleDownload("Consolidado General")}>
            <Download size={18} />
            Exportar Todos
          </Button>
        </div>
      </header>

      <div className={styles.metricsGrid}>
        {summaryData.map((stat) => (
          <Card key={stat.id} className={styles.metricCard}>
            <CardContent style={{ paddingTop: "1.5rem" }}>
              <div className={styles.metricHeader}>
                <span className={styles.metricTitle}>{stat.title}</span>
                <stat.icon size={20} className={styles.metricIcon} />
              </div>
              <div className={styles.metricValue}>{stat.value}</div>
              <div
                className={`${styles.metricTrend} ${
                  stat.trend === "up"
                    ? styles.trendUp
                    : stat.trend === "down"
                      ? styles.trendDown
                      : styles.trendNeutral
                }`}
              >
                {stat.trend === "up" && <ArrowUpRight size={16} />}
                {stat.trend === "down" && <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={styles.chartsSection}>
        {viewMode === 'crecimiento' ? (
          <Card className="glass-panel" style={{ gridColumn: 'span 2' }}>
            <CardHeader>
              <CardTitle>Análisis de Retención y Crecimiento Semanal</CardTitle>
            </CardHeader>
            <CardContent style={{ height: '400px', padding: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRetencion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="nuevos" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorNuevos)" strokeWidth={3} />
                  <Area type="monotone" dataKey="retencion" stroke="var(--success)" fillOpacity={1} fill="url(#colorRetencion)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : viewMode === 'mensual' ? (
          <>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Consolidado Mensual de KPI's</CardTitle>
              </CardHeader>
              <CardContent style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyConsolidated} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={12} width={100} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                    <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                      {monthlyConsolidated.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Estado de Cumplimiento de Metas</CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '350px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>92%</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Objetivos alcanzados este mes</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Membresía', 'Liderazgo', 'Finanzas'].map(goal => (
                    <div key={goal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.875rem' }}>{goal}</span>
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>Completado</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Asistencia Semanal</CardTitle>
              </CardHeader>
              <CardContent style={{ height: "300px", paddingTop: "1rem" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                    <Bar dataKey="nuevos" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Desglose de Ingresos</CardTitle>
              </CardHeader>
              <CardContent style={{ height: "300px", paddingTop: "1rem" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Diezmos', value: 70 },
                        { name: 'Ofrendas', value: 20 },
                        { name: 'Donaciones', value: 10 },
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="var(--accent-primary)" />
                      <Cell fill="var(--success)" />
                      <Cell fill="var(--warning)" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className={styles.tableSection}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              color: "var(--text-primary)",
              fontWeight: 600,
            }}
          >
            Reportes Recientes
          </h3>
          <Button variant="ghost" size="sm">
            Ver historial completo
          </Button>
        </div>
        <TableContainer>
          <TableHead>
            <tr>
              <TableHeader>Nombre del Reporte</TableHeader>
              <TableHeader>Categoría</TableHeader>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader align="right">Acción</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {recentReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell style={{ fontWeight: 500 }}>{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <span className={styles.statusBadge}>{report.status}</span>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: "var(--accent-primary)" }}
                    onClick={() => handleDownload(report.name)}
                  >
                    Descargar PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </div>
    </div>
  );
}
