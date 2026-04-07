import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Network, TrendingUp } from 'lucide-react';

const mockLeaders = [
  { id: 1, name: 'Ana Gómez', role: 'Líder General', group: 'Célula Norte', growth: '+15%', status: 'Activo' },
  { id: 2, name: 'Marcos Ruiz', role: 'Líder', group: 'Célula Sur Primavera', growth: '+5%', status: 'Activo' },
  { id: 3, name: 'Sofía Martínez', role: 'Líder', group: 'Célula Este Renacer', growth: '+22%', status: 'Activo' },
  { id: 4, name: 'Carlos Guerra', role: 'Pastor', group: 'Ministerio Alabanza', growth: '+10%', status: 'Activo' },
];

export function MembersLeaders() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <Card className="glass-panel">
          <CardContent style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <Network size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Líderes Activos</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>12</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardContent style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Efectividad Promedio</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>+13%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <TableContainer>
        <TableHead>
          <tr>
            <TableHeader>Líder</TableHeader>
            <TableHeader>Cargo</TableHeader>
            <TableHeader>Ministerio / Célula Asignada</TableHeader>
            <TableHeader>Crecimiento (Efectividad)</TableHeader>
            <TableHeader align="right">Desempeño</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {mockLeaders.map(leader => (
            <TableRow key={leader.id}>
              <TableCell style={{ fontWeight: 500 }}>{leader.name}</TableCell>
              <TableCell>
                <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                  {leader.role}
                </span>
              </TableCell>
              <TableCell>{leader.group}</TableCell>
              <TableCell>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>{leader.growth}</span>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <Button variant="secondary" size="sm">Ver Detalles</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </div>
  );
}
