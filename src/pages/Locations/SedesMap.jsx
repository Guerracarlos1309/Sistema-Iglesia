import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '../../components/ui/Card';

// Fix for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mapLocations = [
  { id: 1, name: "Sede Central", pastor: "Carlos Guerra", lat: 7.767, lng: -72.228 },
  { id: 2, name: "Sede Tariba", pastor: "Miguel Torres", lat: 7.822, lng: -72.222 },
  { id: 3, name: "Sede Cordero", pastor: "Merly Chacon", lat: 7.848, lng: -72.164 }
];

const center = [7.767, -72.228];

export function SedesMap() {
  return (
    <div style={{ height: '600px', marginTop: '1.5rem' }}>
      <Card style={{ height: '100%', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        <MapContainer center={center} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapLocations.map(site => (
            <Marker key={site.id} position={[site.lat, site.lng]}>
              <Popup>
                <div style={{ color: '#1E293B' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{site.name}</h3>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>Pastor: {site.pastor}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </div>
  );
}
