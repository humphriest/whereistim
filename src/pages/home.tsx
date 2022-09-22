import { NextPage } from "next";
import Map from "components/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import { HeaderTitleContainer, MainContainer } from "./home.styles";
import Stats from "components/Stats/Stats";

const Home: NextPage = () => {
  const [travelData, setTravelData] = useState<ITravelDataResponse>();

  useEffect(() => {
    const getTravelDataFn = async () => {
      const travelDataResponse = await axios.get("/api/travelData");
      setTravelData(travelDataResponse.data);
    };
    getTravelDataFn();
  }, []);

  const renderMap = () => <Map travelData={travelData} />;

  const renderStats = () => <Stats />;

  return (
    <MainContainer>
      <HeaderTitleContainer>
        This is where the magic happens
      </HeaderTitleContainer>
      {renderMap()}
      {renderStats()}
    </MainContainer>
  );
};
export default Home;
