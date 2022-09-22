import { NextPage } from "next";
import { useEffect } from "react";
import { typeWriter } from "utils/typewriter";
import { MainContainer, TravelStatsTitle } from "./Stats.styles";

const Stats: NextPage = () => {
  useEffect(() => {
    const travelTitleDocument = document.getElementById("stats-title");
    console.log(travelTitleDocument);
    if (travelTitleDocument) typeWriter("STATS HERE", travelTitleDocument);
  }, []);

  return (
    <MainContainer id="travel-stats">
      <TravelStatsTitle id="stats-title" style={{ color: "white" }}>
        Test
      </TravelStatsTitle>
    </MainContainer>
  );
};
export default Stats;
