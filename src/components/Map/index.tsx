import MapMarker from "components/MapMarker";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import axios from "axios";
import timPoint from "resources/svgs/timPoint.svg";
import Image from "next/image";

interface IProps {
  travelData?: ITravelData;
}
const Map = ({ travelData }: IProps) => {
  const defaultProps = {
    center: {
      lat: 40.756795,
      lng: -73.954298,
    },
    zoom: 14,
  };

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

  // const handleGoogleMapsLoaded = ({
  //   maps,
  // }: {
  //   map: any;
  //   maps: any;
  //   ref: Element | null;
  // }) => {
  //   var directionsService = new maps.DirectionsService();
  //   var directionsRenderer = new maps.DirectionsRenderer();
  //   var chicago = new maps.LatLng(41.850033, -87.6500523);
  //   var mapOptions = {
  //     zoom: 7,
  //     center: chicago,
  //   };
  //   var map = new maps.Map(document.getElementById("map"), mapOptions);
  //   directionsRenderer.setMap(map);
  //   calcRoute();
  //   function calcRoute() {
  //     var start = document.getElementById("start").value;
  //     var end = document.getElementById("end").value;
  //     var request = {
  //       origin: start,
  //       destination: end,
  //       travelMode: "DRIVING",
  //     };
  //     directionsService.route(request, function (result, status) {
  //       if (status == "OK") {
  //         directionsRenderer.setDirections(result);
  //       }
  //     });
  //   }
  // };

  const handleGoogleMapsLoaded = ({
    maps,
    map,
  }: {
    map: any;
    maps: any;
    ref: Element | null;
  }) => {
    const directionsService = new maps.DirectionsService();
    const directionsRenderer = new maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    const origin = { lat: 40.756795, lng: -73.954298 };
    const destination = { lat: 41.756795, lng: -78.954298 };

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* {renderNowMapMarker()} */}
      {/* <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_TOKEN }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleGoogleMapsLoaded}
      >
        {renderMyTripMarkers()}
        {renderNowMapMarker()}
      </GoogleMapReact> */}
      <h1>Map here</h1>
    </div>
  );
};

export default Map;
