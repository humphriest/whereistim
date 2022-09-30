import MapMarker from "components/MapMarker";
import { useEffect, useRef, useState } from "react";
import timPoint from "resources/svgs/timPoint.svg";
import timPlane from "resources/images/tim-plane-test.png";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import {
  ClickToContinueLink,
  MapContainer,
  ScrollDownSection,
  ScrollDownSectionBackground,
} from "./Map.styles";

const steps = 500;

interface IProps {
  travelData?: ITravelDataResponse;
  onSelectShowState: () => void;
}
let isAtStart = true;

const Map = ({ travelData, onSelectShowState }: IProps) => {
  const map = useRef<mapboxgl.Map | any>(null);

  useEffect(() => {
    if (!travelData) return;

    const now = travelData?.location.now;
    const dublin = travelData?.trips[0];
    const formattedCurrentTrip = travelData.formattedCurrentTrip;

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [dublin?.longitude as number, dublin?.latitude as number],
      zoom: 6,
      pitch: 10,
      projection: { name: "globe" },
    });
    if (!map.current) return;

    map.current.on("style.load", () => {
      map.current.setFog({ "horizon-blend": 0.1 });
    });

    const origin = [dublin?.longitude as number, dublin?.latitude as number];
    const destination = [now?.longitude as number, now?.latitude as number];

    let route: IFeatureCollectionRoute = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [origin, destination],
          },
        },
      ],
    };

    route.features[0].geometry.coordinates = calculateArc(route);

    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    const pulseIcon = createPulseIcon();

    map.current.on("load", () => {
      const mapElement = document.getElementById("map-container");
      if (mapElement) mapElement.style.visibility = "visible";

      map.current.addImage("pulsing-dot", pulseIcon, { pixelRatio: 2 });

      addSvgTimbo();
      addSourceToMap(route, formattedCurrentTrip);
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
        formattedCurrentTrip.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        formattedCurrentTrip.features[0].properties.bearing = turf.bearing(
          turf.point(start),
          turf.point(end)
        );

        // Update the source with this new data
        map.current.getSource("animating-plane").setData(formattedCurrentTrip);

        // Request the next frame of animation as long as the end has not been reached
        if (counter < steps) {
          requestAnimationFrame(animate);
        }

        if (counter === steps) {
          map.current.removeLayer("animating-plane");
          map.current.addLayer({
            id: "animating-plane",
            type: "symbol",
            source: "animating-plane",
            layout: {
              "icon-image": "pulsing-dot",
            },
          });
          map.current.addLayer({
            id: "timePosePoint",
            type: "symbol",
            source: "timePosePoint",
            layout: {
              "icon-image": "tim-pose",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
        }
        counter += 1;
      }

      flyToCurrentLocation();
      animate(counter);
    });
  }, [travelData]);

  const flyToCurrentLocation = () => {
    if (!travelData) return;

    const {
      location: {
        now: { latitude, longitude },
      },
      trips,
    } = travelData;

    const startLocation = trips[0];
    const start = {
      center: [startLocation.longitude, startLocation.latitude],
      zoom: 1,
      pitch: 0,
      bearing: 0,
    };
    const end = {
      center: [longitude, latitude],
      zoom: 4,
      bearing: 0,
      pitch: 5,
    };

    const target = !isAtStart ? start : end;
    isAtStart = !isAtStart;

    map.current.flyTo({
      ...target,
      duration: 10000,
      essential: true,
    });
  };

  const createPulseIcon = () => {
    const size = 150;

    return {
      width: size,
      height: size,
      data: new Uint8ClampedArray(size * size * 4),
      context: null as CanvasRenderingContext2D | null,

      onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 2000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        if (!context) return false;
        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(31, 81, 255, ${1 - t})`;
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.current.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      },
    };
  };

  const addSvgTimbo = () => {
    map.current.loadImage(
      "https://raw.githubusercontent.com/humphriest/whereistim/main/src/resources/images/timbo-pose.png",
      (error?: Error, image?: HTMLImageElement | ImageBitmap) => {
        if (error) return;

        map.current.addImage("tim-pose", image, {
          pixelRatio: 30,
        });

        map.current.addSource("timePosePoint", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    travelData?.location.now.longitude,
                    travelData?.location.now.latitude,
                  ],
                },
              },
            ],
          },
        });
      }
    );
  };

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
        "line-width": 4,
        "line-color": "#1F51FF",
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "#FFC14C",
          0.1,
          "#FF7F5F",
          0.3,
          "#FF3492",
          0.5,
          "#E221CF",
          0.7,
          "#8221e2",
          1,
          "#1F51FF",
        ],
      },
    });

    map.current.addLayer({
      id: "animating-plane",
      source: "animating-plane",
      type: "symbol",
      layout: {
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
      lineMetrics: true,
    });

    map.current.addSource("animating-plane", {
      type: "geojson",
      data: point,
    });

    if (!travelData) return;

    const { formattedTrips, formattedCurrentTrip } = travelData;
    if (travelData?.formattedTrips)
      map.current.addSource("citiesVisited", {
        type: "geojson",
        data: formattedTrips,
      });

    map.current.addSource("dot-point", {
      type: "geojson",
      data: formattedCurrentTrip,
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
      <MapContainer id="map-container" />;
      <ScrollDownSection>
        <ScrollDownSectionBackground>
          <ClickToContinueLink
            className="click-to-continue-text"
            href="#travel-stats"
            onClick={onSelectShowState}
          >
            Click here to see below
          </ClickToContinueLink>
        </ScrollDownSectionBackground>
      </ScrollDownSection>
    </>
  );
};

export default Map;
