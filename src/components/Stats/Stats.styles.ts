import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

export const MainContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  z-index: 999 !important;
  margin-top: 97vh;
  background-color: #0c141f;
  position: absolute;
  flex-direction: column;
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

export const StatsTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TravelStatsTitle = styled.h1`
  font-size: 60px;
  position: relative;
  margin: 20px 50px;
  color: white;
  text-align: center;

  &::after {
    content: "";
    margin-left: 5px;
    border-right: 2px solid white;
    animation: ${blink} 1.5s infinite ease;
    animation-delay: 7.5s;
  }
`;

export const StatsMainContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const StatsBox = styled(motion.div)`
  border: 20px solid #f3f3f3;
  border-radius: 15px;
  height: 200px;
  width: 200px;
  background-color: #f3f3f3;
  transform: rotate(90deg);

  color: black;
  font-size: 16px;
  text-align: center;
  font-size: 26px;

  @media screen and (max-width: 760px) {
    margin: 0;
    width: 100px;
    height: 100px;
  }
`;

export const StatsContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 10%;
  gap: 50px;

  @media screen and (max-width: 760px) {
    grid-template-columns: repeat(2, 2fr);
    gap: 20px;
  }
`;
export const BeerGlassContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;
export const BorderBox = styled.div`
  position: relative;
  transition: all 1s;

  &:before {
    content: "";
    position: absolute;
    top: 25px;
    right: -20px;
    width: 20px;
    height: 60px;
    border: 10px solid lightgray;
    border-radius: 10px;
  }
`;

export const Glass = styled.div`
  position: relative;
  width: 80px;
  height: 120px;
  border-top: 50px solid white;
  background-color: #f3f3f3;
  border-radius: 5px;
  border: 10px solid lightgray;
  border-top: none;
  overflow: hidden;
`;

export const BeerGlassLiquid = styled(motion.div)`
  width: inherit;
  height: inherit;
  background: black;
  transform-origin: 50% 100%;
  border-top: solid 15px white;
`;

export const BeerStats = styled.div`
  padding: 20px;
  text-align: center;
  color: #f3f3f3;
  position: absolute;
`;
