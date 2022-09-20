import MapMarker from "components/MapMarker";
// import GoogleMapReact from "google-map-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import timPoint from "resources/svgs/timPoint.svg";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

interface IProps {
  travelData?: ITravelData;
}

const Map = ({ travelData }: IProps) => {
  const mapContainer = useRef<HTMLElement>(null);
  const map = useRef<mapboxgl.Map | any>(null);

  useEffect(() => {
    const geojson: [number, number][] = [
      [-77.032, 38.913],
      [-122.414, 37.776],
    ];

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN ?? "";
    // if (mapContainer.current)
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [15.4542, 18.7322], // center map on Chad
      zoom: 1.8,
    });

    // add markers to map
    for (const coords of geojson) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(coords).addTo(map.current);
    }
  });

  const renderNowMapMarker = () => {
    const nowLocation = travelData?.location.now;
    if (!!nowLocation)
      return (
        <MapMarker lat={nowLocation?.latitude} lng={nowLocation?.longitude}>
          <Image src={timPoint} alt="TimPoint" width={200} height={200} />
        </MapMarker>
      );
  };

  const renderMyTripMarkers = () =>
    travelData?.trips.map(({ latitude, longitude, place }, i) => {
      if (place === travelData.location.now.city) return null;

      return <MapMarker lat={latitude} lng={longitude} text={place} key={i} />;
    });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div id="map-container" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
