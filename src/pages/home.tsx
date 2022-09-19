import { NextPage } from "next";
import Map from "components/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import { HeaderTitleContainer, MainContainer } from "./home.styles";

const Home: NextPage = () => {
  const [travelData, setTravelData] = useState<ITravelData>();

  useEffect(() => {
    const getTravelDataFn = async () => {
      const travelDataResponse = await axios.get("/api/travelData");
      setTravelData(travelDataResponse.data);
    };
    getTravelDataFn();
  }, []);

  const renderMap = () => <Map travelData={travelData} />;

  return (
    <MainContainer>
      <HeaderTitleContainer>
        This is where the magic happens
      </HeaderTitleContainer>
      {renderMap()}
    </MainContainer>
  );
};
export default Home;
