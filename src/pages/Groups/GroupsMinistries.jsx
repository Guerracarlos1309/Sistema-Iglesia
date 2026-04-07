import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Network, Users, Music, HandHeart, ShieldCheck } from 'lucide-react';

const mockMinistries = [
  { id: 1, name: 'Alabanza y Adoración', leader: 'Carlos Guerra', members: 15, icon: Music, color: 'var(--accent-primary)' },
  { id: 2, name: 'Ujieres y Servidores', leader: 'Marcos Ruiz', members: 25, icon: HandHeart, color: 'var(--warning)' },
  { id: 3, name: 'Seguridad', leader: 'Juan Pérez', members: 8, icon: ShieldCheck, color: 'var(--success)' },
  { id: 4, name: 'Red de Jóvenes', leader: 'Ana Gómez', members: 42, icon: Users, color: 'var(--accent-secondary)' },
];

export function GroupsMinistries() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {mockMinistries.map(ministry => (
          <Card key={ministry.id} className="glass-panel" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ background: `color-mix(in srgb, ${ministry.color} 15%, transparent)`, padding: '0.75rem', borderRadius: '12px', color: ministry.color }}>
                  <ministry.icon size={24} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{ministry.members}</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{ministry.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Líder: {ministry.leader}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 className="page-subtitle" style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Voluntarios Recientes</h3>
        <TableContainer>
          <TableHead>
            <tr>
              <TableHeader>Voluntario</TableHeader>
              <TableHeader>Ministerio Asignado</TableHeader>
              <TableHeader>Última Guardia</TableHeader>
              <TableHeader align="right">Acciones</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontWeight: 500 }}>Samuel Torres</TableCell>
              <TableCell><span style={{ border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Ujieres</span></TableCell>
              <TableCell>Domingo Pasado</TableCell>
              <TableCell style={{ textAlign: 'right' }}><Button variant="secondary" size="sm">Ver Perfil</Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontWeight: 500 }}>Valentina Reyes</TableCell>
              <TableCell><span style={{ border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>Alabanza</span></TableCell>
              <TableCell>Martes de Ensayo</TableCell>
              <TableCell style={{ textAlign: 'right' }}><Button variant="secondary" size="sm">Ver Perfil</Button></TableCell>
            </TableRow>
          </TableBody>
        </TableContainer>
      </div>
    </div>
  );
}
