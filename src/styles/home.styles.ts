import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";

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

interface ITitleProps {
  runEditAnimation: boolean;
}

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const HeaderTitleContainer = styled(motion.div)`
  color: white;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 999;
  position: absolute;
`;

export const CityTitleContainer = styled(motion.div)<ITitleProps>`
  color: white;
  font-size: 50px;
  text-align: center;
  margin: 20px;
  top: auto;
  bottom: auto;

  &::after {
    content: "";
    margin-left: 5px;
    border-right: 2px solid white;
    ${({ runEditAnimation }) =>
      runEditAnimation
        ? css`
            animation: ${blink} 1.5s infinite ease;
          `
        : undefined};
  }
`;

export const StyledLink = styled.a`
  color: #ffffff;
  text-decoration: none;
`;
