export const getFormattedPoint = (
  location: ILocationData | ITrip
): IFeaturePoint => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  },
});

export const getFormattedRoute = (
  origin: ILocationData | ITrip,
  destination: ILocationData | ITrip
): IFeatureRoute => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      [origin.longitude, origin.latitude],
      [destination.longitude, destination.latitude],
    ],
  },
});
