import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  Eye,
  FileText
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
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { useLocation } from "react-router-dom";
import { useToast } from "../../components/ui/Toast";
import { helpFetch, ENDPOINTS } from "../../utils/helpFetch";
import { generateFinancePDF, generateStatsPDF } from "../../utils/pdfExports";
import styles from "./Reports.module.css";

export function Reports() {
  const { addToast } = useToast();
  const { get } = helpFetch();
  const [stats, setStats] = useState(null);
  const [recentFinances, setRecentFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsRes = await get(ENDPOINTS.REPORTS.STATS);
      setStats(statsRes);
      
      // Fetch last 30 days of finances for the table
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const financeRes = await get(`${ENDPOINTS.REPORTS.FINANCE}?startDate=${thirtyDaysAgo}&endDate=${today}`);
      setRecentFinances(financeRes);
    } catch (err) {
      addToast("Error al cargar datos de reportes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportStats = () => {
    if (!stats) return;
    addToast("Generando reporte de estadísticas...");
    generateStatsPDF(stats);
  };

  const handleExportFinances = () => {
    if (recentFinances.length === 0) return;
    addToast("Generando balance financiero...");
    generateFinancePDF(recentFinances, "Balance Financiero Ultimos 30 Dias");
  };

  if (loading) return <div className="loading-spinner">Generando analíticas...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.headerActions}>
        <div>
          <h1 className="page-title">Motor de Reportes</h1>
          <p className="page-subtitle">Generación automatizada de informes detallados</p>
        </div>
        <div className={styles.actionsGroup}>
          <Button variant="outline" onClick={handleExportStats}>
            <FileText size={18} /> Exportar Estadísticas
          </Button>
          <Button variant="primary" onClick={handleExportFinances}>
            <Download size={18} /> Exportar Balance PDF
          </Button>
        </div>
      </header>

      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <CardContent style={{ paddingTop: "1.5rem" }}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Crecimiento de Red</span>
              <Users size={20} className={styles.metricIcon} />
            </div>
            <div className={styles.metricValue}>{stats?.members}</div>
            <div className={styles.trendUp}><ArrowUpRight size={16} /> +5% este periodo</div>
          </CardContent>
        </Card>
        <Card className={styles.metricCard}>
          <CardContent style={{ paddingTop: "1.5rem" }}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Eficiencia Operativa</span>
              <TrendingUp size={20} className={styles.metricIcon} />
            </div>
            <div className={styles.metricValue}>88%</div>
            <div className={styles.trendNeutral}>Calculado por asistencia</div>
          </CardContent>
        </Card>
        <Card className={styles.metricCard}>
          <CardContent style={{ paddingTop: "1.5rem" }}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Balance Consolidado</span>
              <DollarSign size={20} className={styles.metricIcon} />
            </div>
            <div className={styles.metricValue}>${stats?.monthlyFinances?.balance?.toLocaleString()}</div>
            <div className={styles.trendUp}><ArrowUpRight size={16} /> Flujo saludable</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel" style={{ marginTop: '2rem' }}>
        <CardHeader>
          <CardTitle>Historial de Transacciones (Auditoría PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <TableContainer>
            <TableHead>
              <tr>
                <TableHeader>Fecha</TableHeader>
                <TableHeader>Categoría</TableHeader>
                <TableHeader>Descripción</TableHeader>
                <TableHeader>Monto</TableHeader>
                <TableHeader align="right">Estado</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {recentFinances.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.transaction_date).toLocaleDateString()}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell style={{ color: item.transaction_type === 'ingreso' ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>
                    {item.transaction_type === 'ingreso' ? '+' : '-'} ${parseFloat(item.amount).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                     <span className={item.is_verified ? styles.verified : styles.pending}>
                        {item.is_verified ? 'Verificado' : 'Pendiente'}
                     </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
