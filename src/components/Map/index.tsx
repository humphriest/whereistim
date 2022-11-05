import { useEffect, useRef, useState } from "react";
// import timPlane from "resources/images/tim-plane-test.png";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import { MapContainer } from "./Map.styles";
import { getRouteCollection } from "utils/formatForMap";

const steps = 200;

interface IProps {
  travelData?: ITravelDataResponse;
}
let isAtStart = true;

const Map = ({ travelData }: IProps) => {
  const map = useRef<mapboxgl.Map | any>(null);
  const [animatedRoute, setAnimatedRoute] = useState<IFeatureCollectionRoute>();
  const [mapReady, setMapReady] = useState<boolean>();

  useEffect(() => {
    if (!travelData) return;
    const { now } = travelData.location;

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [now?.longitude as number, now?.latitude as number],
      zoom: 2,
      pitch: 10,
      projection: { name: "globe" },
    });

    if (!map.current) return;

    map.current.on("style.load", () => {
      map.current.setFog({ "horizon-blend": 0.1 });
    });

    setupRouteAnimation();

    map.current.on("load", () => {
      const mapElement = document.getElementById("map-container");
      if (mapElement) mapElement.style.visibility = "visible";

      setMapReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelData]);

  useEffect(() => {
    if (mapReady) {
      const pulseIcon = createPulseIcon();

      map.current.addImage("pulsing-dot", pulseIcon, { pixelRatio: 2 });

      addSvgTimbo();
      addSourceToMap();
      addLayerToMap();
      beginAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedRoute, mapReady]);

  const beginAnimation = () => {
    let counter = 0;

    const animate = (time: number) => {
      const { formattedCurrentTrip } = travelData as ITravelDataResponse;
      const start =
        animatedRoute?.features[0].geometry.coordinates[
          counter >= steps ? counter - 1 : counter
        ];

      const end =
        animatedRoute?.features[0].geometry.coordinates[
          counter >= steps ? counter : counter + 1
        ];

      if (!start || !end) return;

      // Update point geometry to a new position based on counter denoting
      // the index to access the arc
      formattedCurrentTrip.features[0].geometry.coordinates = animatedRoute
        .features[0].geometry.coordinates[counter] as [number, number];

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
    };

    animate(counter);
  };

  const setupRouteAnimation = () => {
    const { location, trips } = travelData as ITravelDataResponse;
    const now = location.now;
    const dublin = trips[trips.length - 1];
    const origin = [dublin?.longitude as number, dublin?.latitude as number];
    const destination = [now?.longitude as number, now?.latitude as number];

    const route: IFeatureCollectionRoute = getRouteCollection(
      origin,
      destination
    );

    route.features[0].geometry.coordinates = calculateArc(route);

    setAnimatedRoute(route);
  };

  // const animateMapToCurrentLocation = () => {
  //   if (!travelData) return;

  //   const {
  //     location: {
  //       now: { latitude, longitude },
  //     },
  //     trips,
  //   } = travelData;

  //   const startLocation = trips[trips.length - 1];

  //   const start = {
  //     center: [startLocation.longitude, startLocation.latitude],
  //     zoom: 1,
  //     pitch: 0,
  //     bearing: 0,
  //   };
  //   const end = {
  //     center: [longitude, latitude],
  //     zoom: 4,
  //     bearing: 0,
  //     pitch: 5,
  //   };

  //   const target = !isAtStart ? start : end;
  //   isAtStart = !isAtStart;

  //   map.current.flyTo({
  //     ...target,
  //     duration: 6000,
  //     essential: true,
  //   });
  // };

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
          pixelRatio: 20,
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

  const addSourceToMap = () => {
    if (!travelData) return;

    const { formattedPreviousTrips, formattedNextTrips, formattedCurrentTrip } =
      travelData;

    map.current.addSource("route", {
      type: "geojson",
      data: animatedRoute,
      lineMetrics: true,
    });

    map.current.addSource("animating-plane", {
      type: "geojson",
      data: formattedCurrentTrip,
    });

    if (!!formattedPreviousTrips) {
      formattedPreviousTrips.map(
        ({ longitude, latitude, place, country, length }) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div>
          ${place}, ${country}
          <br />
          ${length} days
        </div>`);

          const el = document.createElement("div");
          el.className = "marker";
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.borderRadius = "12px";
          el.style.backgroundSize = "100%";
          el.style.backgroundColor = "#00FF00";
          el.style.border = "2px solid #FFFFFF";

          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map.current);
        }
      );
    }

    if (!!formattedNextTrips) {
      formattedNextTrips.map(
        ({ longitude, latitude, place, country, length }) => {
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div>
          ${place}, ${country}
          <br />
          ${length} days
        </div>`);

          const el = document.createElement("div");
          el.className = "marker";
          el.style.width = "12px";
          el.style.height = "12px";
          el.style.borderRadius = "12px";
          el.style.backgroundSize = "100%";
          el.style.backgroundColor = "#FF0000";
          el.style.border = "2px solid #FFFFFF";

          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map.current);
        }
      );
    }

    map.current.addSource("nextCities", {
      type: "geojson",
      data: formattedNextTrips,
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

  return <MapContainer id="map-container" />;
};

export default Map;
