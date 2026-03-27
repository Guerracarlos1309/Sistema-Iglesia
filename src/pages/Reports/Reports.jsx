import React, { useState } from "react";
import {
  Download,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "../../components/ui/Table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import styles from "./Reports.module.css";

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
  const [activeTab, setActiveTab] = useState("General");

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
          <Button variant="primary">
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
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Asistencia Semanal</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className={styles.barChartContainer}
              style={{ width: "100%", height: "200px" }}
            >
              <div className={styles.barWrapper}>
                <div className={styles.bar} style={{ height: "60%" }}></div>
                <span>Sem 1</span>
              </div>
              <div className={styles.barWrapper}>
                <div className={styles.bar} style={{ height: "75%" }}></div>
                <span>Sem 2</span>
              </div>
              <div className={styles.barWrapper}>
                <div className={styles.bar} style={{ height: "45%" }}></div>
                <span>Sem 3</span>
              </div>
              <div className={styles.barWrapper}>
                <div className={styles.bar} style={{ height: "90%" }}></div>
                <span>Sem 4</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Desglose de Ingresos</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={styles.progressContainer}>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Diezmos</span>
                  <span>70%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: "70%",
                      background: "var(--accent-primary)",
                    }}
                  ></div>
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Ofrendas</span>
                  <span>20%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: "20%", background: "var(--success)" }}
                  ></div>
                </div>
              </div>
              <div className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>Donaciones Especiales</span>
                  <span>10%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: "10%", background: "var(--warning)" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
