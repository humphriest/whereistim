export const getFormattedPoint = (location: ILocationData | ITrip) => ({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
    },
  ],
});

export const getFormattedRoute = (
  origin: ILocationData | ITrip,
  destination: ILocationData | ITrip
) => ({
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
});
