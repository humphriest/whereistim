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
  BackgroundBox,
  BeerGlassContainer,
  BeerGlassLiquid,
  BeerStats,
  BorderBox,
  DistanceTravelled,
  Glass,
  MainContainer,
  MainContentContainer,
  StatsBox,
  StatsBoxContent,
  StatsBoxTitle,
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

  const getTimeTravelled = () => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const today = new Date();
    const dateLeft = new Date("04/23/2022");
    const timeDiff = Math.abs(dateLeft.getTime() - today.getTime());
    const timeGone = Math.ceil(timeDiff / day);

    return timeGone;
  };

  const renderBackgroundTiles = () => {
    const colours = [
      "#1F51FF",
      "#E221CF",
      "#FF3492",
      "#FF7F5F",
      "#FFC14C",
      "#F9F871",
    ];
    // display squares with the same border radius
    // different sizes
    // one for each of the colours, maybe 2 of each colour
    // they'll be placed on the screen at random using Math.random
    // they'll have an opacity of 0.2/0.3
    // when you scroll down they'll animate from the top down maybe
    // that could be too many different animations
    if (typeof window === "undefined") return <></>;

    return (
      <div
        style={{
          position: "absolute",
          maxHeight: "100vh",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {colours.map((colour, i) => {
          const divSize = (Math.random() * 100 + 50).toFixed();

          const posx = (
            Math.random() *
            (window.innerWidth - parseInt(divSize))
          ).toFixed();
          const posy = (
            Math.random() *
            (window.innerHeight - parseInt(divSize))
          ).toFixed();

          return (
            <BackgroundBox
              style={{
                left: posx + "px",
                top: posy + "px",
                opacity: 0.65 * Math.random(),
              }}
              key={colour}
              color={colour}
            />
          );
        })}
      </div>
    );
  };

  return (
    <MainContainer id="travel-stats">
      {renderBackgroundTiles()}
      <MainContentContainer>
        <StatsTitleContainer>
          <TravelStatsTitle id="stats-title" />
        </StatsTitleContainer>
        <StatsMainContainer>
          <StatsContentContainer>
            <StatsBox style={{ scale, opacity }}>
              <StatsBoxTitle>KMS TRAVELLED</StatsBoxTitle>
              <StatsBoxContent>
                <DistanceTravelled id="distance-travelled" />
              </StatsBoxContent>
            </StatsBox>
            <StatsBox style={{ scale, opacity }}>
              <StatsBoxTitle>AMOUNT OF TIME GONE</StatsBoxTitle>
              <StatsBoxContent>{getTimeTravelled()} days</StatsBoxContent>
            </StatsBox>
            <StatsBox style={{ scale, opacity }}>
              <StatsBoxTitle>NUMBER OF CITIES VISITED</StatsBoxTitle>
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
            <StatsBox style={{ scale, opacity }}>
              DISTANCE AWAY FROM YOU
            </StatsBox>
            <StatsBox style={{ scale, opacity }}>NUMBER OF PINTS</StatsBox>
          </StatsContentContainer>
        </StatsMainContainer>
      </MainContentContainer>
    </MainContainer>
  );
};
export default Stats;
