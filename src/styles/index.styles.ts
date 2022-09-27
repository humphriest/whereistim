import { motion } from "framer-motion";
import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const TitleText = styled(motion.div)`
  color: #ffffff;
  font-size: 15rem;
  font-weight: 600;
  margin-top: -40px;
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 5rem;
  }
`;

export const Footer = styled(motion.footer)`
  position: fixed;
  bottom: 0;
  padding-bottom: 60px;
`;

export const DescriptionContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: center;
  gap: 5rem;

  @media screen and (max-width: 768px) {
    gap: 2rem;
  }
`;

export const StartDescriptionText = styled.div`
  animation: resize 4s infinite;
  color: #f9f871;
  font-size: 40px;

  @keyframes resize {
    0% {
      transform: scale(100%);
    }
    50% {
      transform: scale(120%);
    }
    100% {
      transform: scale(100%);
    }
  }

  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`;
