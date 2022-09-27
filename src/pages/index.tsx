import type { NextPage } from "next";
import Image from "next/image";
import "styles/Home.module.css";
import coffeeSvg from "resources/svgs/coffee.svg";
import spinningCoin from "resources/images/spinning_coin.gif";
import {
  DescriptionContainer,
  Footer,
  MainContainer,
  StartDescriptionText,
  TitleText,
} from "styles/index.styles";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { animate, useMotionValue, useTime, useTransform } from "framer-motion";

const Home: NextPage = () => {
  const router = useRouter();
  const motionValue = useMotionValue(0);
  const titleScale = useTransform(motionValue, [0, 1], [1, 200]);
  const restOfScreenScale = useTransform(motionValue, [0, 0.1], [1, 0]);

  useEffect(() => {
    window.addEventListener("keypress", actionListener);
    window.addEventListener("mousedown", actionListener);

    return () => {
      window.removeEventListener("keypress", actionListener);
      window.removeEventListener("mousedown", actionListener);
    };
  }, [undefined]);

  const actionListener = (e: KeyboardEvent | MouseEvent) => {
    e.preventDefault();

    animate(motionValue, 1, {
      duration: 1.5,
      ease: "easeInOut",
      onComplete: () => {
        router.push("/home");
      },
    });
  };
  return (
    <MainContainer>
      <TitleText
        style={{
          scale: titleScale,
          fontWeight: "bolder",
        }}
      >
        WHERE IS TIM?
      </TitleText>
      <DescriptionContainer style={{ scale: restOfScreenScale }}>
        <StartDescriptionText>PRESS ANY KEY TO START</StartDescriptionText>
        <Image src={spinningCoin} alt="" width={80} height={80} />
      </DescriptionContainer>
      <Footer style={{ scale: restOfScreenScale }}>
        <a
          style={{ color: "#FFFFFF" }}
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          POWERED BY
          <span>
            <Image
              src={coffeeSvg}
              alt="Coffee"
              width={30}
              color="#FFFFFF"
              height={20}
            />
          </span>
          COFFEE
        </a>
      </Footer>
    </MainContainer>
  );
};

export default Home;
