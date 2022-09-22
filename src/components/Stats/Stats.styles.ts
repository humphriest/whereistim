import styled, { keyframes } from "styled-components";

export const MainContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  z-index: 999 !important;
  margin-top: 97vh;
  background-color: #0c141f;
  position: absolute;
`;

const blink = keyframes`
0%{
  opacity:1;
}
50%{
  opacity: 1
}
100%{
  opacity:0
}`;

export const TravelStatsTitle = styled.h1`
  font-size: 60px;
  position: relative;
  margin-left: 10px;

  &::after {
    content: "";
    margin-left: 5px;
    border-right: 2px solid white;
    animation: ${blink} 1.5s infinite ease;
  }
`;
