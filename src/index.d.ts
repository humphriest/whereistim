declare interface IRequest<Data> {
  data: Data;
}

declare interface ITravelData {
  location: {
    now: ILocationData;
    next: ILocationData;
    previous: ILocationData;
  };
  stats: ITravelStats;
  trips: ITrip[];
  map: string;
}

declare interface ITravelDataResponse extends ITravelData {
  formattedTrips: IFeatureCollectionPoint;
  formattedPreviousTrip: IFeatureCollectionPoint;
  formattedCurrentTrip: IFeatureCollectionPoint;
  formattedPreviousTrips: ITrip[];
  formattedNextTrips: ITrip[];
}
declare interface ILocationData {
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  epoch_start: number;
  epoch_end: number;
  date_start: string;
  date_end: string;
  place_photo?: string;
}

declare interface ITrip {
  epoch_start: number;
  epoch_end: number;
  date_start: string;
  date_end: string;
  length: string;
  epoch_duration: number;
  place: string;
  place_slug: string | number | null;
  place_long_slug: string | number | null;
  place_url: string | null;
  place_photo: string;
  country: string;
  country_code: string;
  country_slug: string;
  latitude: number;
  longitude: number;
  trip_id: string;
}

declare interface ITravelStats {
  cities: number;
  countries: number;
  followers: number;
  following: number;
  distance_traveled_km: number;
  distance_traveled_miles: number;
  countries_visited_percentage: number;
  cities_visited_percentage: number;
}

declare interface IFeatureCollectionPoint {
  type: "FeatureCollection";
  features: IFeaturePoint[];
}
declare interface IFeaturePoint {
  type: "Feature";
  properties: Properties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

declare interface IFeatureCollectionRoute {
  type: "FeatureCollection";
  features: IFeatureRoute[];
}
declare interface IFeatureRoute {
  type: "Feature";
  properties: Properties;
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
}
