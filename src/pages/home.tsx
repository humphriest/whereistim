import { NextPage } from "next";
import Map from "components/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CityTitleContainer,
  HeaderTitleContainer,
  MainContainer,
} from "styles/home.styles";
import Stats from "components/Stats/Stats";
import { typeWriter } from "utils/typewriter";
import { animate, useMotionValue, useTransform } from "framer-motion";

const Home: NextPage<{ name: string }> = (props: { name: string }) => {
  const [travelData, setTravelData] = useState<ITravelDataResponse>();
  const [shouldShowStats, setShouldShowState] = useState(false);
  const [hasTypingFinished, setHasTypingFinished] = useState(false);
  const motionValue = useMotionValue(0);
  const height = useTransform(motionValue, [0, 1], ["100%", "8vh"]);

  useEffect(() => {
    const getTravelDataFn = async () => {
      const travelDataResponse: IRequest<ITravelDataResponse> = await axios.get(
        "/api/travelData"
      );
      setTravelData(travelDataResponse.data);
    };
    getTravelDataFn();
  }, []);

  useEffect(() => {
    if (travelData) {
      const now = travelData?.location?.now;

      const currentLocationTitleId =
        document.getElementById("current-location");
      if (!currentLocationTitleId) return;

      typeWriter(
        `${now.city.toUpperCase()}, ${now.country.toUpperCase()}`,
        currentLocationTitleId,
        runCallBack
      );

      // axios.get(
      //   `https://api.openweathermap.org/data/3.0/onecall?lat=${now.latitude}&lon=${now.longitude}&appid=06bdf6d946296e1f5016f48de6651884
      //   `
      // );
    }
  }, [travelData]);

  const runCallBack = () => {
    setTimeout(() => {
      animate(motionValue, 1, {
        duration: 1,
        ease: "easeInOut",
        onComplete: () => {
          setHasTypingFinished(true);
        },
      });
    }, 500);
  };

  const onSelectShowState = () => {
    setShouldShowState(true);
  };

  const renderMap = () =>
    hasTypingFinished && (
      <Map travelData={travelData} onSelectShowState={onSelectShowState} />
    );

  const renderStats = () =>
    shouldShowStats && <Stats travelData={travelData} />;

  return (
    <MainContainer>
      <HeaderTitleContainer
        style={{
          height,
        }}
      >
        <CityTitleContainer
          id="current-location"
          hasTypingFinished={hasTypingFinished}
        ></CityTitleContainer>
      </HeaderTitleContainer>
      {renderMap()}
      {renderStats()}
    </MainContainer>
  );
};
export default Home;
