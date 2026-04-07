import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const dataBar = [
  { name: 'Ene', Ingresos: 4000, Egresos: 2400 },
  { name: 'Feb', Ingresos: 3000, Egresos: 1398 },
  { name: 'Mar', Ingresos: 2000, Egresos: 9800 },
  { name: 'Abr', Ingresos: 2780, Egresos: 3908 },
  { name: 'May', Ingresos: 1890, Egresos: 4800 },
  { name: 'Jun', Ingresos: 2390, Egresos: 3800 },
  { name: 'Jul', Ingresos: 3490, Egresos: 4300 },
];

const dataPie = [
  { name: 'Mantenimiento', value: 400 },
  { name: 'Misiones', value: 300 },
  { name: 'Servicios Básicos', value: 300 },
  { name: 'Ayuda Social', value: 200 },
];

const COLORS = ['var(--accent-primary)', 'var(--warning)', 'var(--danger)', 'var(--success)'];

export function FinancesDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card className="glass-panel">
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Balance Total Anual</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>+$12,450.00</h3>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ofrendas del Mes</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>+$3,200.00</h3>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gastos Operativos (Mes)</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>-$1,800.00</h3>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Histórico: Ingresos vs Egresos</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '350px', padding: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Ingresos" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Egresos" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent style={{ height: '350px', padding: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
