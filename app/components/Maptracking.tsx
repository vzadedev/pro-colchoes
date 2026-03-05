'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção para os ícones padrão do Leaflet no Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Array "chumbado" simulando dados do backend (Coordenadas próximas a Santa Fé do Sul como exemplo)
const equipamentos = [
  { id: 1, nome: 'Trator John Deere 8R', lat: -20.2162, lng: -50.9329, status: 'Em Movimento' },
  { id: 2, nome: 'Colheitadeira Case IH 250', lat: -20.2362, lng: -50.9129, status: 'Parado' },
  { id: 3, nome: 'Pulverizador Jacto', lat: -20.2562, lng: -50.9629, status: 'Em Manutenção' },
];

export default function MapTracking() {
  return (
    <MapContainer 
      center={[-20.2362, -50.9329]} 
      zoom={12} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {equipamentos.map((eq) => (
        <Marker key={eq.id} position={[eq.lat, eq.lng]} icon={customIcon}>
          <Popup>
            <div className="text-sm">
              <strong className="block text-base">{eq.nome}</strong>
              <span className="text-gray-600">Status: {eq.status}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}