import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '120rem',
  height: '40rem'
};

const center = {
  lat: 10.829976081848145,
  lng: 106.77667999267578
};

const MapComponent = () => {
  return (
    <div className="relative w-100% h-full">
      <LoadScript googleMapsApiKey="AIzaSyBqGhInS-WbsZORgWtCN0FQlV__9N-gNIA">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          options={{ mapId: 'DEMO_MAP_ID' }}
        >
          <Marker position={center} title="My location" />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapComponent;
