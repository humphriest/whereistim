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
import getTravelData from "utils/getTravelData";

const Home: NextPage = () => {
  const [travelData, setTravelData] = useState<ITravelDataResponse>();
  const [shouldShowStats, setShouldShowState] = useState(false);
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
    if (travelData) {
      const now = travelData?.location?.now;

      const currentLocationTitleId =
        document.getElementById("current-location");
      if (!currentLocationTitleId) return;

      setRunEditAnimation(false);
      typeWriter(
        `${now.city.toUpperCase()}, ${now.country.toUpperCase()}`,
        currentLocationTitleId,
        runCallBack
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelData]);

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

  const onSelectShowState = () => {
    setShouldShowState(true);
  };

  const renderMap = () =>
    motionValue.get() === 1 && (
      <Map travelData={travelData} onSelectShowState={onSelectShowState} />
    );

  return (
    <MainContainer>
      <HeaderTitleContainer
        style={{
          height,
        }}
      >
        <CityTitleContainer
          id="current-location"
          animate={runEditAnimation}
        ></CityTitleContainer>
      </HeaderTitleContainer>
      {renderMap()}
    </MainContainer>
  );
};
export default Home;
