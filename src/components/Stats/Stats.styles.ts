import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";

interface IBackgroundBoxProps {
  color: string;
}

const getBoxSize = () => {
  const boxSize = `${300 * Math.random()}px`;
  return css`
    width: ${boxSize};
    height: ${boxSize};
  `;
};

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 97vh;
`;

export const MainContentContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  z-index: 999 !important;

  position: absolute;
  flex-direction: column;
`;

export const BackgroundBox = styled.div<IBackgroundBoxProps>`
  background-color: ${({ color }) => color};
  ${getBoxSize}

  border-radius: 10px;
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
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 760px) {
    margin: 0;
    width: 120px;
    height: 120px;

    font-size: 18px;
  }
`;

export const StatsBoxTitle = styled.div`
  flex: 0.2;
`;

export const StatsBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: inherit;
  font-size: 32px;
  padding: 0 5px;
  flex: 0.8;
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

    @media screen and (max-width: 760px) {
      height: 25px;
      width: 10px;
      border: 5px solid lightgray;
      right: -10px;
      top: 15px;
    }
  }
`;

export const Glass = styled.div`
  position: relative;
  width: 80px;
  height: 120px;
  border-top: 50px solid white;
  background-color: #f3f3f3;
  border-radius: 5px;
  border: 5px solid lightgray;
  border-top: none;
  overflow: hidden;

  @media screen and (max-width: 760px) {
    width: 40px;
    height: 60px;
  }
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

  @media screen and (max-width: 760px) {
    padding: 0;
    padding-top: 5px;
  }
`;

export const DistanceTravelled = styled.div`
  font-size: 36px;
  text-align: center;

  &::after {
    content: "Kms";
    padding-left: 5px;
  }

  @media screen and (max-width: 760px) {
    font-size: 28px;
  }
`;
