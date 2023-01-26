import axios, { AxiosResponse } from "axios";
import {
  getFormattedNextTrips,
  getFormattedPoint,
  getFormattedPreviousTrips,
  getRouteCollection,
} from "utils/formatForMap";

const fallbackTravelData: ITravelData = {
  location: {
    now: {
      city: "Ottawa",
      country: "Canada",
      country_code: "CA",
      latitude: 45.4215296,
      longitude: -75.6971931,
      epoch_start: 1666915200,
      epoch_end: 1668211200,
      date_start: "2022-10-28",
      date_end: "2022-11-12",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/ottawa-canada.jpg?1642528936",
    },
    next: {
      city: "Iqaluit",
      country: "Canada",
      country_code: "CA",
      latitude: 63.74944,
      longitude: -68.521857,
      epoch_start: 1668211200,
      epoch_end: 1668816000,
      date_start: "2022-11-12",
      date_end: "2022-11-19",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=600,height=300,quality=25/https://nomadlist.com/assets/img/places/canada.jpg?1653007433.jpg?",
    },
    previous: {
      city: "Toronto",
      country: "Canada",
      country_code: "CA",
      latitude: 43.653226,
      longitude: -79.3831843,
      epoch_start: 1664496000,
      epoch_end: 1666915200,
      date_start: "2022-09-30",
      date_end: "2022-10-28",
    },
  },
  stats: {
    cities: 15,
    countries: 6,
    followers: 0,
    following: 0,
    distance_traveled_km: 18640,
    distance_traveled_miles: 11582,
    countries_visited_percentage: 0.031088082901554404,
    cities_visited_percentage: 0.01105379513633014,
  },
  map: "https://nomadlist.com/screenshot?url=%40humphries_t%3Fmap_only%3Dtrue%26key%3D9bb2813b8e67a2ba1e0271f26a16454a&width=1200&height=600&wait_until_dom=true&cachebuster=2022-10",
  trips: [
    {
      epoch_start: 1671235200,
      epoch_end: 1673049600,
      date_start: "2022-12-17",
      date_end: "2023-01-07",
      length: "20 days",
      epoch_duration: 1814400,
      place: "Dublin",
      place_slug: "dublin",
      place_long_slug: "dublin-ireland",
      place_url: "https://nomadlist.com/dublin-ireland",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/dublin-ireland.jpg?1651537303",
      country: "Ireland",
      country_code: "IE",
      country_slug: "ireland",
      latitude: 53.3498053,
      longitude: -6.2603097,
      trip_id: "164253119476fe87f563a0ccdbb34ab275bbd45a2160d289bb",
    },
    {
      epoch_start: 1668902400,
      epoch_end: 1671148800,
      date_start: "2022-11-20",
      date_end: "2022-12-16",
      length: "25 days",
      epoch_duration: 2246400,
      place: "Montreal",
      place_slug: "montreal",
      place_long_slug: "montreal-canada",
      place_url: "https://nomadlist.com/montreal-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/montreal-canada.jpg?1642464123",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 45.5086699,
      longitude: -73.5539925,
      trip_id: "166027618120b446af685cd7802098565cbda51575cbf2a2a2",
    },
    {
      epoch_start: 1668211200,
      epoch_end: 1668816000,
      date_start: "2022-11-12",
      date_end: "2022-11-19",
      length: "6 days",
      epoch_duration: 604800,
      place: "Iqaluit",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/canada.jpg?1653007433",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 63.74944,
      longitude: -68.521857,
      trip_id: "1660276165c827d83e80f9f66fb4b15c2f8b1c60523d27012b",
    },
    {
      epoch_start: 1666915200,
      epoch_end: 1668211200,
      date_start: "2022-10-28",
      date_end: "2022-11-12",
      length: "14 days",
      epoch_duration: 1296000,
      place: "Ottawa",
      place_slug: "ottawa",
      place_long_slug: "ottawa-canada",
      place_url: "https://nomadlist.com/ottawa-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/ottawa-canada.jpg?1642528936",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 45.4215296,
      longitude: -75.6971931,
      trip_id: "16602761344889f0f51b77db6608b09e1e7dbb5ec2fd374e67",
    },
    {
      epoch_start: 1664496000,
      epoch_end: 1666915200,
      date_start: "2022-09-30",
      date_end: "2022-10-28",
      length: "27 days",
      epoch_duration: 2419200,
      place: "Toronto",
      place_slug: "toronto",
      place_long_slug: "toronto-canada",
      place_url: "https://nomadlist.com/toronto-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/toronto-canada.jpg?1656633769",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 43.653226,
      longitude: -79.3831843,
      trip_id: "1660276154931b0c1bb98704390cc59d3c5e47102f56273b34",
    },
    {
      epoch_start: 1663372800,
      epoch_end: 1664496000,
      date_start: "2022-09-17",
      date_end: "2022-09-30",
      length: "12 days",
      epoch_duration: 1123200,
      place: "Edmonton",
      place_slug: "edmonton",
      place_long_slug: "edmonton-canada",
      place_url: "https://nomadlist.com/edmonton-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/edmonton-canada.jpg?1642982507",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 53.544389,
      longitude: -113.4909267,
      trip_id: "166329412171a6d9f3ded549af1f7a4546330f40b7d1e7aaea",
    },
    {
      epoch_start: 1662336000,
      epoch_end: 1663372800,
      date_start: "2022-09-05",
      date_end: "2022-09-17",
      length: "11 days",
      epoch_duration: 1036800,
      place: "Calgary",
      place_slug: "calgary",
      place_long_slug: "calgary-canada",
      place_url: "https://nomadlist.com/calgary-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/calgary-canada.jpg?1663805118",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 51.0486151,
      longitude: -114.0708459,
      trip_id: "1663294115c17a68535ca944407af3ccad66ceda56f68c2e85",
    },
    {
      epoch_start: 1662249600,
      epoch_end: 1662336000,
      date_start: "2022-09-04",
      date_end: "2022-09-05",
      length: "23 hours",
      epoch_duration: 86400,
      place: "Radium Hot Springs",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/canada.jpg?1653007433",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 50.620073,
      longitude: -116.076059,
      trip_id: "1663294103a993bbd1ed584c9135f1768c59b96a474b904f05",
    },
    {
      epoch_start: 1662163200,
      epoch_end: 1662249600,
      date_start: "2022-09-03",
      date_end: "2022-09-04",
      length: "23 hours",
      epoch_duration: 86400,
      place: "Johnston Canyon Campground",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/canada.jpg?1653007433",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 51.24143,
      longitude: -115.840034,
      trip_id: "16632940737dab0bf5aa2e7239529389dc19f30c6896afd630",
    },
    {
      epoch_start: 1662076800,
      epoch_end: 1662163200,
      date_start: "2022-09-02",
      date_end: "2022-09-03",
      length: "23 hours",
      epoch_duration: 86400,
      place: "Jasper National Park",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/canada.jpg?1653007433",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 52.876832,
      longitude: -118.080813,
      trip_id: "1663294010fe78c8c539013e0b25168a0eb048d27dadddfbb3",
    },
    {
      epoch_start: 1661385600,
      epoch_end: 1662076800,
      date_start: "2022-08-25",
      date_end: "2022-09-02",
      length: "7 days",
      epoch_duration: 691200,
      place: "Calgary",
      place_slug: "calgary",
      place_long_slug: "calgary-canada",
      place_url: "https://nomadlist.com/calgary-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/calgary-canada.jpg?1663805118",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 51.0486151,
      longitude: -114.0708459,
      trip_id: "16632940806fb67171fb2b5251b9403df2faae068388375927",
    },
    {
      epoch_start: 1660953600,
      epoch_end: 1661385600,
      date_start: "2022-08-20",
      date_end: "2022-08-25",
      length: "4 days",
      epoch_duration: 432000,
      place: "Manzanita Beach Overlook",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/united-states.jpg?1642529757",
      country: "United States",
      country_code: "US",
      country_slug: "united-states",
      latitude: 45.743512,
      longitude: -123.958358,
      trip_id: "16632597930f20048797ba5dddd12dfcedb5989d1ab6ea130d",
    },
    {
      epoch_start: 1660262400,
      epoch_end: 1660953600,
      date_start: "2022-08-12",
      date_end: "2022-08-20",
      length: "7 days",
      epoch_duration: 691200,
      place: "Hood River",
      place_slug: null,
      place_long_slug: null,
      place_url: null,
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/united-states.jpg?1642529757",
      country: "United States",
      country_code: "US",
      country_slug: "united-states",
      latitude: 45.70879,
      longitude: -121.512373,
      trip_id: "16632597690f02235185a7f480ef26df1ede94b7ab1b51a227",
    },
    {
      epoch_start: 1659657600,
      epoch_end: 1660262400,
      date_start: "2022-08-05",
      date_end: "2022-08-12",
      length: "6 days",
      epoch_duration: 604800,
      place: "Victoria",
      place_slug: "victoria",
      place_long_slug: "victoria-canada",
      place_url: "https://nomadlist.com/victoria-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/victoria-canada.jpg?1642528934",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 48.4284207,
      longitude: -123.3656444,
      trip_id: "1660276085fe63f562c930cb9316d3139655ae0df36696f73d",
    },
    {
      epoch_start: 1657324800,
      epoch_end: 1659657600,
      date_start: "2022-07-09",
      date_end: "2022-08-05",
      length: "26 days",
      epoch_duration: 2332800,
      place: "Vancouver",
      place_slug: "vancouver",
      place_long_slug: "vancouver-canada",
      place_url: "https://nomadlist.com/vancouver-canada",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/vancouver-canada.jpg?1666829011",
      country: "Canada",
      country_code: "CA",
      country_slug: "canada",
      latitude: 49.261226,
      longitude: -123.1139268,
      trip_id: "1660276075f19079488070fa0875a5eb8e1c0175b2f234362b",
    },
    {
      epoch_start: 1656892800,
      epoch_end: 1657324800,
      date_start: "2022-07-04",
      date_end: "2022-07-09",
      length: "4 days",
      epoch_duration: 432000,
      place: "Dublin",
      place_slug: "dublin",
      place_long_slug: "dublin-ireland",
      place_url: "https://nomadlist.com/dublin-ireland",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/dublin-ireland.jpg?1651537303",
      country: "Ireland",
      country_code: "IE",
      country_slug: "ireland",
      latitude: 53.3498053,
      longitude: -6.2603097,
      trip_id: "165208639801adee74cb318875449942c75ba1fa3c27bcca59",
    },
    {
      epoch_start: 1656633600,
      epoch_end: 1656892800,
      date_start: "2022-07-01",
      date_end: "2022-07-04",
      length: "2 days",
      epoch_duration: 259200,
      place: "Lyon",
      place_slug: "lyon",
      place_long_slug: "lyon-france",
      place_url: "https://nomadlist.com/lyon-france",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/lyon-france.jpg?1650153786",
      country: "France",
      country_code: "FR",
      country_slug: "france",
      latitude: 45.764043,
      longitude: 4.835659,
      trip_id: "16520863746433332763b800591da8ab499e5803c742237e1f",
    },
    {
      epoch_start: 1655337600,
      epoch_end: 1656633600,
      date_start: "2022-06-16",
      date_end: "2022-07-01",
      length: "14 days",
      epoch_duration: 1296000,
      place: "Dublin",
      place_slug: "dublin",
      place_long_slug: "dublin-ireland",
      place_url: "https://nomadlist.com/dublin-ireland",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/dublin-ireland.jpg?1651537303",
      country: "Ireland",
      country_code: "IE",
      country_slug: "ireland",
      latitude: 53.3498053,
      longitude: -6.2603097,
      trip_id: "16632599332a4ec609b271fbae07cbae2cc5618ed51e3891b2",
    },
    {
      epoch_start: 1652486400,
      epoch_end: 1655337600,
      date_start: "2022-05-14",
      date_end: "2022-06-16",
      length: "1 month",
      epoch_duration: 2851200,
      place: "Barcelona",
      place_slug: "barcelona",
      place_long_slug: "barcelona-spain",
      place_url: "https://nomadlist.com/barcelona-spain",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/barcelona-spain.jpg?1644278483",
      country: "Spain",
      country_code: "ES",
      country_slug: "spain",
      latitude: 41.3850639,
      longitude: 2.1734035,
      trip_id: "165208633775408730c5cd71c750eb6ea1bf5408c621c28746",
    },
    {
      epoch_start: 1650672000,
      epoch_end: 1652486400,
      date_start: "2022-04-23",
      date_end: "2022-05-14",
      length: "20 days",
      epoch_duration: 1814400,
      place: "Amsterdam",
      place_slug: "amsterdam",
      place_long_slug: "amsterdam-netherlands",
      place_url: "https://nomadlist.com/amsterdam-netherlands",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/amsterdam-netherlands.jpg?1643155472",
      country: "Netherlands",
      country_code: "NL",
      country_slug: "netherlands",
      latitude: 52.376884,
      longitude: 4.907764,
      trip_id: "1642161507f6c2e8cf59702adb5443eb04a9bc94856abc9a7a",
    },
    {
      epoch_start: 1640995200,
      epoch_end: 1650672000,
      date_start: "2022-01-01",
      date_end: "2022-04-23",
      length: "3 months",
      epoch_duration: 9676800,
      place: "Dublin",
      place_slug: "dublin",
      place_long_slug: "dublin-ireland",
      place_url: "https://nomadlist.com/dublin-ireland",
      place_photo:
        "https://nomadlist.com/cdn-cgi/image/format=auto,fit=cover,width=100,height=100/https://nomadlist.com/assets/img/places/dublin-ireland.jpg?1651537303",
      country: "Ireland",
      country_code: "IE",
      country_slug: "ireland",
      latitude: 53.3498053,
      longitude: -6.2603097,
      trip_id: "1642584227994dac37c78c13122321f06b1fbe16f5de8b75f9",
    },
  ],
};

const getTravelData = async (): Promise<ITravelDataResponse> => {
  try {
    const response: AxiosResponse<ITravelData> = await axios.get(
      "https://nomadlist.com/@humphries_t.json"
    );

    return geFormattedTravelData(response.data);
  } catch (err) {
    return getFallbackTravelData();
  }
};

const geFormattedTravelData = (
  travelData: ITravelData
): ITravelDataResponse => {
  const { location, trips } = travelData;
  let currentLocationIndex = 0;

  const formattedTripFeatures: IFeaturePoint[] = trips.map((trip) => {
    return getFormattedPoint(trip);
  });

  const tempTrips = [...trips];
  tempTrips.reverse().forEach((trip, i) => {
    if (
      location.now.latitude === trip.latitude &&
      location?.now?.longitude === trip.longitude
    ) {
      currentLocationIndex = i;
    }
  });

  const formattedPreviousTrip: IFeaturePoint = getFormattedPoint(
    location.previous
  );
  const formattedCurrentTrip: IFeaturePoint = getFormattedPoint(location.now);
  const formattedNextTrip: IFeaturePoint = getFormattedPoint(location.next);

  const previousTrips = getFormattedPreviousTrips(trips);
  const nextTrips = getFormattedNextTrips(trips);

  const formattedRouteCollections = getFormattedRouteCollections(travelData);

  return {
    ...travelData,
    formattedTrips: {
      type: "FeatureCollection",
      features: formattedTripFeatures,
    },
    formattedPreviousTrip: {
      type: "FeatureCollection",
      features: [formattedPreviousTrip],
    },
    formattedCurrentTrip: {
      type: "FeatureCollection",
      features: [formattedCurrentTrip],
    },
    formattedPreviousTrips: previousTrips,
    formattedNextTrip: {
      type: "FeatureCollection",
      features: [formattedNextTrip],
    },
    formattedNextTrips: nextTrips,
    formattedRouteCollections,
    currentLocationIndex,
  };
};

const getFallbackTravelData = (): ITravelDataResponse => {
  const formattedTripFeatures: IFeaturePoint[] = fallbackTravelData.trips.map(
    (trip) => getFormattedPoint(trip)
  );
  const formattedPreviousTrip: IFeaturePoint = getFormattedPoint(
    fallbackTravelData.location.previous
  );
  const formattedCurrentTrip: IFeaturePoint = getFormattedPoint(
    fallbackTravelData.location.now
  );

  const formattedNextTrip: IFeaturePoint = getFormattedPoint(
    fallbackTravelData.location.next
  );

  const previousTrips = getFormattedPreviousTrips(fallbackTravelData.trips);
  const nextTrips = getFormattedNextTrips(fallbackTravelData.trips);

  return {
    ...fallbackTravelData,
    formattedTrips: {
      type: "FeatureCollection",
      features: formattedTripFeatures,
    },
    formattedPreviousTrip: {
      type: "FeatureCollection",
      features: [formattedPreviousTrip],
    },
    formattedCurrentTrip: {
      type: "FeatureCollection",
      features: [formattedCurrentTrip],
    },
    formattedPreviousTrips: previousTrips,
    formattedNextTrips: nextTrips,
    formattedNextTrip: {
      type: "FeatureCollection",
      features: [formattedNextTrip],
    },
    formattedRouteCollections: getFormattedRouteCollections(fallbackTravelData),
    currentLocationIndex: 0,
  };
};

const getFormattedRouteCollections = ({
  trips,
}: ITravelData): IFeatureCollectionRoute[] =>
  trips
    .reverse()
    .map((trip, i) => {
      if (i + 1 === trips.length) return;

      const origin = trip;
      const destination = trips[i + 1];

      return getRouteCollection(
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude]
      );
    })
    .filter(Boolean) as IFeatureCollectionRoute[];

export default getTravelData;
