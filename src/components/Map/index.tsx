import { useEffect, useRef, useState } from "react";
// import timPlane from "resources/images/tim-plane-test.png";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { bearing, distance, point } from "@turf/turf";
import { MapContainer } from "./Map.styles";
import { getRouteCollection } from "utils/formatForMap";
import { calculateArc } from "utils/mapHelper";
import { createPulseIcon } from "components/PulseIcon";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const steps = 151;
interface IProps {
  travelData?: ITravelDataResponse;
}
let isAtStart = true;

const Map = ({ travelData }: IProps) => {
  const map = useRef<mapboxgl.Map | any>(null);
  const [animatedRoute, setAnimatedRoute] = useState<IFeatureCollectionRoute>();
  const [mapReady, setMapReady] = useState<boolean>();
  const [tripIndex, setTripIndex] = useState<number>(0);

  useEffect(() => {
    if (!travelData) return;
    const { trips } = travelData;

    mapboxgl.accessToken = process.env.MAPBOX_GL_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [trips[0]?.longitude as number, trips[0]?.latitude as number],
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
      const pulseIcon = createPulseIcon(map);

      map.current.addImage("pulsing-dot", pulseIcon, { pixelRatio: 2 });

      addSvgTimbo();
      addSourceToMap();
      addLayerToMap();
      beginAnimation(steps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  useEffect(() => {
    if (!travelData) return;

    const currentLocationIndex = travelData?.currentLocationIndex;

    if (tripIndex < currentLocationIndex) {
      setupRouteAnimation();
    } else {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripIndex]);

  useEffect(() => {
    if (!travelData) return;

    console.log(animatedRoute);

    const { trips } = travelData as ITravelDataResponse;
    const startLocation = trips[tripIndex];
    const endLocation = trips[tripIndex + 1];

    const from = [startLocation.longitude, startLocation.latitude];
    const to = [endLocation.longitude, endLocation.latitude];
    const distanceInKms = distance(from, to, { units: "kilometers" });

    if (mapReady) beginAnimation(distanceInKms / 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedRoute]);

  const beginAnimation = (steps2: number) => {
    let counter = 0;
    const planePosition = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { bearing: 0 },
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
        },
      ],
    };

    const animate = () => {
      let pointA =
        animatedRoute?.features[0].geometry.coordinates[
          counter >= steps ? counter - 1 : counter
        ];

      let pointB =
        animatedRoute?.features[0].geometry.coordinates[
          counter >= steps ? counter : counter + 1
        ];

      if (!pointB && !!pointA) pointB = pointA;

      if (!pointA || !pointB) return;

      // Update point geometry to a new position based on counter denoting
      // the index to access the arc
      planePosition.features[0].geometry.coordinates = animatedRoute
        ?.features[0].geometry.coordinates[counter] as [number, number];

      // Calculate the bearing to ensure the icon is rotated to match the route arc
      // The bearing is calculated between the current point and the next point, except
      // at the end of the arc, which uses the previous point and the current point
      planePosition.features[0].properties.bearing = bearing(
        point(pointA),
        point(pointB)
      );

      // Update the source with this new data
      map.current.getSource("animating-plane").setData(planePosition);

      // Request the next frame of animation as long as the end has not been reached
      if (counter < steps) {
        requestAnimationFrame(animate);
      }

      if (counter === steps) {
        setTripIndex((index) => index + 1);
        counter = 0;
      }
      counter += 1;
    };

    animate();
  };

  const setupRouteAnimation = () => {
    if (!travelData) return;

    const { trips } = travelData as ITravelDataResponse;
    const startLocation = trips[tripIndex];
    const endLocation = trips[tripIndex + 1];
    const origin = [
      startLocation?.longitude as number,
      startLocation?.latitude as number,
    ];
    const destination = [
      endLocation?.longitude as number,
      endLocation?.latitude as number,
    ];

    const route: IFeatureCollectionRoute = getRouteCollection(
      origin,
      destination
    );

    route.features[0].geometry.coordinates = calculateArc(route, steps);
    route.features[0].geometry.coordinates.push(destination);

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

    const {
      formattedPreviousTrips,
      formattedNextTrips,
      formattedCurrentTrip,
      location: { now },
    } = travelData;

    map.current.addSource("route", {
      type: "geojson",
      data: animatedRoute,
      lineMetrics: true,
    });
    //   const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div>
    //   ${now.city}, ${now.country}
    //   <br />
    //   ${dayjs(now.date_start).toNow()} days
    // </div>`);
    // .setPopup(popup);

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
          const popup: any = new mapboxgl.Popup({ offset: 25 }).setHTML(`<div>
          ${place}, ${country}
          <br />
          ${length}
        </div>`);
          popup._content.style.textAlign = "center";

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

  return <MapContainer id="map-container" />;
};

export default Map;
