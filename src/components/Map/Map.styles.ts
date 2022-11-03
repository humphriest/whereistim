import styled from "styled-components";

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed !important;
  top: 0;
  z-index: 5 !important;
  visibility: hidden;
`;

export const ScrollDownSection = styled.div`
  position: absolute;
  width: 100%;
  height: 4rem;
  bottom: 0;
  z-index: 999;
`;

export const ScrollDownSectionBackground = styled.div`
  background-image: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 5%,
    rgba(255, 255, 255, 0.1) 10%,
    rgba(255, 255, 255, 0.4) 40%,
    rgba(255, 255, 255, 0.55) 55%,
    rgba(255, 255, 255, 0.7) 70%,
    rgba(255, 255, 255, 0.85) 85%,
    rgba(255, 255, 255, 1) 100%
  );
  width: 100%;
  height: 100%;
  z-index: inherit;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
`;

export const ClickToContinueLink = styled.a`
  color: black;
  font-weight: bold;
  font-size: 30px;
  padding-bottom: 10px;
  text-decoration: none;
`;
