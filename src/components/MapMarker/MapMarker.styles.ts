import styled from "styled-components";

interface IMarkerColor {
  color?: string;
}
export const MarkerContainer = styled.div<IMarkerColor>`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${({ color }) => color};
`;
