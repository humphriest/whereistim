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

export const getFormattedPreviousTrips = (trips: ITrip[]) =>
  trips
    .filter(
      ({ date_start, date_end }) =>
        new Date() > new Date(date_start) && new Date(date_end) <= new Date()
    )
    .map((trip) => trip);

export const getFormattedNextTrips = (trips: ITrip[]) =>
  trips.filter(({ date_start }) => new Date() < new Date(date_start));
