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
} from "./index.styles";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
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
    router.push("/home");
  };
  return (
    <MainContainer>
      <TitleText>WHERE IS TIM?</TitleText>
      <DescriptionContainer>
        <StartDescriptionText>PRESS ANY KEY TO START</StartDescriptionText>
        <Image src={spinningCoin} alt="" width={80} height={80} />
      </DescriptionContainer>
      <Footer>
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
