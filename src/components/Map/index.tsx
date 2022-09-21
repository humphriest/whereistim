import MapMarker from "components/MapMarker";
import { useEffect, useRef, useState } from "react";
// import timPoint from "resources/svgs/timPoint.svg";
// import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
// import { getFormattedPoint } from "utils/formatForMap";

const steps = 550;

interface IProps {
  travelData?: ITravelDataResponse;
}

const Map = ({ travelData }: IProps) => {
  const map = useRef<mapboxgl.Map | any>(null);

  useEffect(() => {
    if (!travelData) return;

    const now = travelData?.location.now;
    const previous = travelData?.trips[0];

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [now?.longitude as number, now?.latitude as number],
      zoom: 6,
      pitch: 10,
      projection: { name: "globe" },
    });
    if (!map.current) return;

    map.current.on("style.load", () => {
      map.current.setFog({ "horizon-blend": 0.1 });
    });

    const origin = [
      previous?.longitude as number,
      previous?.latitude as number,
    ];
    const destination = [now?.longitude as number, now?.latitude as number];

    let route: IFeatureCollectionRoute = {
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

    const point: IFeatureCollectionPoint = {
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

    route.features[0].geometry.coordinates = calculateArc(route);

    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    map.current.on("load", () => {
      addSourceToMap(route, point);
      addLayerToMap();

      function animate(time: number) {
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

      animate(counter);
    });
  }, [travelData]);

  const addLayerToMap = () => {
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
  };

  const addSourceToMap = (
    route: IFeatureCollectionRoute,
    point: IFeatureCollectionPoint
  ) => {
    // Add a source and layer displaying a point which will be animated in a circle.
    map.current.addSource("route", {
      type: "geojson",
      data: route,
    });

    map.current.addSource("point", {
      type: "geojson",
      data: point,
    });

    if (travelData?.formattedTrips)
      map.current.addSource("citiesVisited", {
        type: "geojson",
        data: travelData?.formattedTrips,
      });
  };

  const calculateArc = (route: IFeatureCollectionRoute) => {
    const lineDistance = turf.length(route.features[0]);
    const arc = [];

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along(route.features[0], i);
      arc.push(segment.geometry.coordinates);
    }

    return arc;
  };

  return (
    <>
      <div id="map-container" style={{ width: "100%", height: "100vh" }} />;
      <div className="linear-gradient-container">
        <div className="click-to-slide">
          <div className="click-to-continue-text">Click here to see below</div>
        </div>
      </div>
    </>
  );
};

export default Map;
