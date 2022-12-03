import { useEffect, useState } from "react";
import styled from "styled-components";
import ScreenOne from "./HomePage/ScreenOne";
import ScreenThree from "./HomePage/ScreenThree";
import ScreenTwo from "./HomePage/ScreenTwo";
import ScreenFive from "./HomePage/ScreenFive";
import ScreenSix from "./HomePage/ScreenSix";
import {
  getQuestionWithHightestTVL,
  QuestionDataWithAmount,
} from "../util/getData";
import SmoothScroll from "./HomePage/SmoothScroll";
import "./HomePage/styles.css";
import Carousel, { CarouselItem } from "./Carousel";
import BackToTopButton from "./HomePage/BackToTopButton";
import ScreenFourPointOneMob from "./HomePage/ScreenFourPointOneMob";
import ScreenFourPointTwoMob from "./HomePage/ScreenFourPointTwoMob";
import ScreenFourPointFourMob from "./HomePage/ScreenFourPointFourMob";
import ScreenFourPointThreeMob from "./HomePage/ScreenFourPointThreeMob";
import { useNetworkManager } from "../state/network/hooks";
const Wrapper = styled.div`
  position: relative;
`;

function Homepage() {
  const [topThree, setTopThree] = useState<QuestionDataWithAmount[]>([]);
  const [currentNetwork] = useNetworkManager()
  useEffect(() => {
    getQuestionWithHightestTVL(currentNetwork.graphEndpoint, currentNetwork.baseUrl).then((result) => {
      if (result) setTopThree(result);
    });
  }, []);
  return (
    <Wrapper>
      <ScreenOne top={topThree[0]} />
      {/* <ScreenTwo /> */}
      {/* <ScreenThree second={topThree[1]} third={topThree[2]} />
      {
        <Carousel state={state} setState={setState}>
          <CarouselItem index={0} length={4} state={state}>
            <ScreenFourPointOneMob />
          </CarouselItem>
          <CarouselItem index={1} length={4} state={state}>
            <ScreenFourPointTwoMob />
          </CarouselItem>
          <CarouselItem index={2} length={4} state={state}>
            <ScreenFourPointThreeMob />
          </CarouselItem>
          <CarouselItem index={3} length={4} state={state}>
            <ScreenFourPointFourMob />
          </CarouselItem>
        </Carousel>
      }
      <SmoothScroll />
      <ScreenFive />
      <ScreenSix />
      <BackToTopButton /> */}
    </Wrapper>
  );
}

export default Homepage;
