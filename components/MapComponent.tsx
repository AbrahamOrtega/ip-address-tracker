"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { icon } from "leaflet";
import { useEffect } from "react";
import Image from "next/image";

interface MapComponentProps {
  position: [number, number];
}

function MapViewUpdater({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

export default function MapComponent({ position }: MapComponentProps) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={position}
        icon={icon({
          iconUrl: "/images/icon-location.svg",
          iconSize: [32, 40],
        })}
      >
        <Image
          src="/images/icon-location.svg"
          alt="Marker Icon"
          width={30}
          height={40}
        />
      </Marker>
      <MapViewUpdater position={position} />
    </MapContainer>
  );
}
