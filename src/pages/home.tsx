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

const Home: NextPage = () => {
  const [travelData, setTravelData] = useState<ITravelDataResponse>();
  const [shouldShowStats, setShouldShowState] = useState(false);
  const [runEditAnimation, setRunEditAnimation] = useState(true);
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

      setTimeout(() => {
        setRunEditAnimation(false);
        typeWriter(
          `${now.city.toUpperCase()}, ${now.country.toUpperCase()}`,
          currentLocationTitleId,
          runCallBack
        );
      }, 2800);
    }
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
          runEditAnimation={runEditAnimation}
        ></CityTitleContainer>
      </HeaderTitleContainer>
      {renderMap()}
      {/* {renderStats()} */}
    </MainContainer>
  );
};
export default Home;
