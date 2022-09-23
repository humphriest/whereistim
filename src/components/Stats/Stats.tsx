import {
  useMotionValue,
  useScroll,
  useTransform,
  animate,
} from "framer-motion";
import { NextPage } from "next";
import { useEffect } from "react";
import { animatedNumberCounter } from "utils/animtedNumberCounter";
import { typeWriter } from "utils/typewriter";
import {
  BeerGlassContainer,
  BeerGlassLiquid,
  BeerStats,
  BorderBox,
  DistanceTravelled,
  Glass,
  MainContainer,
  StatsBox,
  StatsBoxContent,
  StatsContentContainer,
  StatsMainContainer,
  StatsTitleContainer,
  TravelStatsTitle,
} from "./Stats.styles";

interface IProps {
  travelData?: ITravelDataResponse;
}
const STATS_TITLE = "MY TRAVEL STATS";

const Stats = ({ travelData }: IProps) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0, 0, 0, 0, 1]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 1],
    [0, 0, 0, 0, 1]
  );
  const beer = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.9, 0.925, 0.95, 0.975, 1],
    [0, 0, 0, 0, 0, 0.25, 0.5, 0.75, 1]
  );
  const motionValue = useMotionValue(0);
  const amountOfBeer = useTransform(motionValue, [0, 1], [0, 1]);

  useEffect(() => {
    setTimeout(() => {
      animate(motionValue, 1, {
        duration: 1,
        ease: "easeInOut",
        onComplete: () => {
          motionValue.set(1);
        },
      });
    }, 1000);

    const travelTitleDocument = document.getElementById("stats-title");
    if (travelTitleDocument) travelTitleDocument.innerHTML = STATS_TITLE;
    // if (travelTitleDocument) typeWriter(STATS_TITLE, travelTitleDocument);
  }, []);

  useEffect(() => {
    const distanceTravelled = document.getElementById("distance-travelled");
    if (distanceTravelled && travelData?.stats?.distance_traveled_km)
      animatedNumberCounter(
        travelData.stats.distance_traveled_km,
        distanceTravelled
      );
  }, [travelData]);
  return (
    <MainContainer id="travel-stats">
      <StatsTitleContainer>
        <TravelStatsTitle id="stats-title" />
      </StatsTitleContainer>
      <StatsMainContainer>
        <StatsContentContainer>
          <StatsBox style={{ scale, opacity }}>
            KMS TRAVELLED
            <StatsBoxContent>
              <DistanceTravelled id="distance-travelled" />
            </StatsBoxContent>
          </StatsBox>
          <StatsBox style={{ scale, opacity }}>AMOUNT OF TIME GONE</StatsBox>
          <StatsBox style={{ scale, opacity }}>
            NUMBER OF CITIES VISITED
          </StatsBox>
          <StatsBox style={{ scale, opacity }}>
            AMOUNT OF SHITE TALKED
            <BeerGlassContainer>
              <BorderBox>
                <Glass>
                  <BeerGlassLiquid
                    style={{
                      // When adding more animation this might work
                      scaleY: motionValue.get() == 1 ? beer : amountOfBeer,
                    }}
                  >
                    <BeerStats>TOO MUCH</BeerStats>
                  </BeerGlassLiquid>
                </Glass>
              </BorderBox>
            </BeerGlassContainer>
          </StatsBox>
          <StatsBox style={{ scale, opacity }}>DISTANCE AWAY FROM YOU</StatsBox>
          <StatsBox style={{ scale, opacity }}>NUMBER OF PINTS</StatsBox>
        </StatsContentContainer>
      </StatsMainContainer>
    </MainContainer>
  );
};
export default Stats;
