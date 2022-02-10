import styled, { css, keyframes } from "styled-components";

const widenAnimation = () => keyframes`
  0% {
    width: 15%;
    opacity: 25%;
  }
  100% {
    width: 100%;
  }
`;

const widenAnimationRule = css`
  ${widenAnimation};
`;

const tallenAnimation = () => keyframes`
  0% {
    max-height: 0px;
    opacity: 0%;
  }
  100% {
    max-height: 200px;
    opacity: 100%;
  }
`;

const tallenAnimationRule = css`
  ${tallenAnimation};
`;

const speedMap = {
  "-2": "5s",
  "-1": "1s",
  "0": "0.25s",
  "1": "0.1s",
  "2": "0.05s",
};
export const FadeInWiderDiv = styled.div<{
  speed?: keyof typeof speedMap;
}>`
  animation: ${widenAnimationRule};
  animation-duration: ${(props) =>
    props.speed ? speedMap[props.speed] : speedMap["0"]};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
`;

export const FadeInTallerDiv = styled.div<{
  speed?: keyof typeof speedMap;
}>`
  animation: ${tallenAnimationRule};
  animation-duration: ${(props) =>
    props.speed ? speedMap[props.speed] : speedMap["0"]};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
`;

export const HSpacer = styled.div<{ scale: number }>`
  width: ${(props) => props.scale * 4}px;
  height: 4px;
`;

export const Heading1 = styled.div`
  margin-block-start: 0.2em;
  margin-block-end: 0.1em;
  font-size: 2em;
  font-weight: bold;
`;
export const Heading2 = styled.div`
  margin-block-start: 0.5em;
  margin-block-end: 0.15em;
  font-size: 1.4em;
  font-weight: 400;
`;
export const Heading3 = styled.div`
  margin-block-start: 0.15em;
  margin-block-end: 0.1em;
  font-size: 1.17em;
  font-weight: bold;
`;
export const Heading4 = styled.div`
  margin-block-start: 0.5em;
  margin-block-end: 0.15em;
  font-size: 1em;
  font-weight: bold;
`;
