import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent } from '../../components/ui/Card';

// Fix para los iconos por defecto de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mapGroups = [
  { id: 1, name: "Célula Norte Central", leader: "Ana Gómez", lat: 7.768, lng: -72.225, type: 'Jóvenes' },
  { id: 2, name: "Célula Sur Primavera", leader: "Marcos Ruiz", lat: 7.755, lng: -72.235, type: 'Familias' },
  { id: 3, name: "Célula Este Renacer", leader: "Sofía Martínez", lat: 7.760, lng: -72.215, type: 'General' },
  { id: 4, name: "Célula Cordero", leader: "Carlos Guerra", lat: 7.846, lng: -72.164, type: 'General' }
];

// San Cristóbal, Táchira aprox center
const center = [7.767, -72.228];

export function GroupsMap() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '600px' }}>
      <Card style={{ flex: 1, overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapGroups.map(group => (
            <Marker key={group.id} position={[group.lat, group.lng]}>
              <Popup>
                <div style={{ color: '#1E293B', padding: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{group.name}</h3>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>Líder: {group.leader}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>Tipo: {group.type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </div>
  );
}
