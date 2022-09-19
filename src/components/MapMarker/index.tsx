import { MarkerContainer } from "./MapMarker.styles";

const MapMarker = ({
  color = "red",
  text,
  children,
}: {
  lat: number;
  lng: number;
  color?: string;
  text?: string;
  children?: JSX.Element;
}) => {
  if (children) return children;

  return <MarkerContainer color={color} />;
};

export default MapMarker;
