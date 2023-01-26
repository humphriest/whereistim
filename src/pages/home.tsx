import { NextPage } from "next";
import Map from "components/Map";
import { useEffect, useState } from "react";
import {
  CityTitleContainer,
  HeaderTitleContainer,
  MainContainer,
} from "styles/home.styles";
import { typeWriter } from "utils/typewriter";
import { animate, useMotionValue, useTransform } from "framer-motion";
import getTravelData from "apis/travelData";
import { getTimezone } from "apis/timezone";

const Home: NextPage = () => {
  const [travelData, setTravelData] = useState<ITravelDataResponse>();
  const [runEditAnimation, setRunEditAnimation] = useState(true);
  const motionValue = useMotionValue(0);
  const height = useTransform(motionValue, [0, 1], ["100%", "8vh"]);

  useEffect(() => {
    const getTravelDataFn = async () => {
      const travelDataResponse: ITravelDataResponse = await getTravelData();
      setTravelData(travelDataResponse);
    };
    getTravelDataFn();
  }, []);

  useEffect(() => {
    setHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelData]);

  const setHeader = async () => {
    if (!travelData) return;
    const now = travelData?.location?.now;
    const currentLocationTitleId = document.getElementById("current-location");
    if (!currentLocationTitleId) return;
    setRunEditAnimation(false);
    const formattedTime = await getTimezone(now.latitude, now.longitude);
    typeWriter(
      `${now.city.toUpperCase()}, ${now.country.toUpperCase()} \n ${formattedTime?.toUpperCase()}`,
      currentLocationTitleId,
      runCallBack
    );
  };

  const runCallBack = () => {
    setTimeout(() => {
      animate(motionValue, 1, {
        duration: 1,
        ease: "easeInOut",
        onComplete: () => {
          setRunEditAnimation(true);
        },
      });
    }, 500);
  };

  // const renderMap = () =>
  //   motionValue.get() === 1 && <Map travelData={travelData} />;
  const renderMap = () => <Map travelData={travelData} />;

  return (
    <MainContainer>
      {/* <HeaderTitleContainer
        style={{
          height,
        }}
      >
        <CityTitleContainer id="current-location" animate={runEditAnimation} />
      </HeaderTitleContainer> */}
      {renderMap()}
    </MainContainer>
  );
};
export default Home;
