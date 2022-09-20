import MapMarker from "components/MapMarker";
import { useEffect, useRef, useState } from "react";
import timPoint from "resources/svgs/timPoint.svg";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import { getFormattedPoint } from "utils/formatForMap";

interface IProps {
  travelData?: ITravelDataResponse;
}

const Map = ({ travelData }: IProps) => {
  const map = useRef<mapboxgl.Map | any>(null);

  // const now = travelData?.location.now;
  console.log(travelData);

  useEffect(() => {
    if (!travelData) return;

    const now = travelData?.location.now;
    // start from dublin
    const previous = travelData?.trips[0];
    const formattedTrips = travelData.formattedTrips;

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [now?.longitude as number, now?.latitude as number],
      zoom: 6,
      pitch: 10,
      projection: { name: "globe" },
    });

    map.current.on("style.load", () => {
      map.current.setFog({ "horizon-blend": 0.1 }); // Enable stars with reduced atmosphere
    });

    // San Francisco
    const origin = [
      previous?.longitude as number,
      previous?.latitude as number,
    ];

    // Washington DC
    const destination = [now?.longitude as number, now?.latitude as number];

    // A simple line from origin to destination.
    const route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [origin, destination],
          },
        },
      ],
    };

    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    const point = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: origin,
          },
        },
      ],
    };

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = turf.length(route.features[0]);

    const arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    const steps = 550;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    map.current.on("load", () => {
      map.current.addSource("citiesVisited", {
        type: "geojson",
        data: formattedTrips,
      });

      map.current.addLayer({
        id: "citiesVisited",
        source: "citiesVisited",
        type: "circle",
        paint: {
          "circle-radius": 4,
          "circle-stroke-width": 2,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      });
      // Add a source and layer displaying a point which will be animated in a circle.
      map.current.addSource("route", {
        type: "geojson",
        data: route,
      });

      map.current.addSource("point", {
        type: "geojson",
        data: point,
      });

      map.current.addLayer({
        id: "route",
        source: "route",
        type: "line",
        paint: {
          "line-width": 2,
          "line-color": "#007cbf",
        },
      });

      map.current.addLayer({
        id: "point",
        source: "point",
        type: "symbol",
        layout: {
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "icon-image": "airport-15",
          "icon-size": 2,
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      function animate() {
        const start =
          route.features[0].geometry.coordinates[
            counter >= steps ? counter - 1 : counter
          ];
        const end =
          route.features[0].geometry.coordinates[
            counter >= steps ? counter : counter + 1
          ];
        if (!start || !end) return;

        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        point.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        point.features[0].properties.bearing = turf.bearing(
          turf.point(start),
          turf.point(end)
        );

        // Update the source with this new data
        map.current.getSource("point").setData(point);

        // Request the next frame of animation as long as the end has not been reached
        if (counter < steps) {
          requestAnimationFrame(animate);
        }

        counter = counter + 1;
      }

      // document.getElementById("replay").addEventListener("click", () => {
      //   // Set the coordinates of the original point back to origin
      //   point.features[0].geometry.coordinates = origin;

      //   // Update the source layer
      //   map.current.getSource("point").setData(point);

      //   // Reset the counter
      //   counter = 0;

      //   // Restart the animation
      //   animate(counter);
      // });

      // Start the animation
      animate(counter);
    });
  }, [travelData]);

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
    <>
      <div id="map-container" style={{ width: "100%", height: "100%" }} />;
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <button id="replay">Replay</button>
      </div>
    </>
  );
};

export default Map;
