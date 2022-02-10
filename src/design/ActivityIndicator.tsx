import styled, { css, keyframes } from "styled-components";
import { CustomThemeType } from "./theme";

const animation = (props: { theme: CustomThemeType }) => keyframes`
  from, to {
    color: transparent;
  }
  50% {
    color: gray;
  }
`;
const animationRule = css`
  ${animation};
`;

const Activity = styled.div`
  margin: 0px;
  padding: 0px;
  animation: ${animationRule};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: step-end;
`;

export function ActivityIndicator(props: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", ...props.style }}>
      <Activity>█</Activity>
    </div>
  );
}
