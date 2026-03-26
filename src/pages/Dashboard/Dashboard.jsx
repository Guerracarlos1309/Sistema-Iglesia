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
import styles from "./Dashboard.module.css";

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
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Crecimiento de Membresía</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)" }}>
              [Gráfico de líneas simulado]
            </p>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Asistencia por Células</CardTitle>
          </CardHeader>
          <CardContent
            style={{
              minHeight: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)" }}>
              [Gráfico de barras simulado]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
