import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ pois }) => {
    return (
    <MapContainer center={[3.1390, 101.6869]} zoom={13} style={{ height: '90vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

        {pois.map(poi => (
            <Marker key={poi.id} position={poi.coordinates}>
                <Popup>{poi.name}</Popup>
            </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;