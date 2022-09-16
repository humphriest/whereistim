import { NextPage } from "next";
import GoogleMapReact from "google-map-react";

const Home: NextPage = () => {
  const AnyReactComponent = ({ text }: { text: string }) => (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "10px",
        backgroundColor: "red",
      }}
    />
  );

  const renderMap = () => {
    const defaultProps = {
      center: {
        lat: 51.035632,
        lng: -114.093067,
      },
      zoom: 4,
    };

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.GOOGLE_TOKEN }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={51.035632}
            lng={-114.093067}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1 style={{ color: "white", marginLeft: "50px" }}>
        This is where the magic happens
      </h1>
      {renderMap()}
    </div>
  );
};
export default Home;
