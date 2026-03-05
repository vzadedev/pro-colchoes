"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { PosicaoVeiculo } from "../types";
import type { Veiculo } from "../types";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapRastreamentoProps {
  posicoes: PosicaoVeiculo[];
  veiculos: Veiculo[];
}

/**
 * Mapa de rastreamento com marcadores dos veículos em rota
 */
export default function MapRastreamento({
  posicoes,
  veiculos,
}: MapRastreamentoProps) {
  const centro: [number, number] = posicoes.length
    ? [
        posicoes.reduce((s, p) => s + p.latitude, 0) / posicoes.length,
        posicoes.reduce((s, p) => s + p.longitude, 0) / posicoes.length,
      ] as [number, number]
    : [-20.4697, -54.6201];

  return (
    <MapContainer
      center={centro}
      zoom={12}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {posicoes.map((p) => {
        const veiculo = veiculos.find((v) => v.id === p.veiculoId);
        return (
          <Marker
            key={p.veiculoId}
            position={[p.latitude, p.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong className="block">
                  {veiculo?.placa ?? p.veiculoId}
                </strong>
                <span className="text-gray-600">{veiculo?.modelo}</span>
                <br />
                <span>Velocidade: {p.velocidade} km/h</span>
                <br />
                <span>Status: {p.status}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
