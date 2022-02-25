import { Dispatch, ReactNode, SetStateAction } from "react";
import styled, { css, keyframes } from "styled-components";
import { CustomThemeType } from "./theme";

const animation = (props: { theme: CustomThemeType }) => keyframes`
    0%   {
        background-color: transparent;
    }
    50%  {
        background-color: ${props.theme.NavBlade.label.colorOnHighlight};
    }
    100%  {
        background-color: transparent;
        color: ${props.theme.NavBlade.label.colorWhenSelected};
    }
`;
const animationRule = css<{ active: boolean }>`
  ${(props) => (props.active ? animation : "")} 0.25s linear;
`;

const NavBladeInternalDiv = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  -webkit-tap-highlight-color: transparent;
`;
const NavBladeDiv = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: ${(props) => props.theme.NavBlade.label.color};
  margin-top: 4px;
`;

const NavBladeButtonDiv = styled.div<{ active: boolean }>`
  cursor: pointer;
  margin-right: 4px;
  animation: ${animationRule};
`;
const NavBladeButtonLabel = styled.span<{ active: boolean }>`
  cursor: pointer;
  text-decoration: ${(props) => (props.active ? "underline" : "")};
  color: ${(props) =>
    props.active
      ? props.theme.NavBlade.label.colorWhenSelected
      : props.theme.NavBlade.label.color};
`;

export const NavBlade = ({
  children,
  leftArrow = false,
  label = "",
}: {
  children: ReactNode | ReactNode[];
  leftArrow?: boolean;
  label?: string;
}) => {
  return (
    <NavBladeDiv>
      <NavBladeInternalDiv>
        {label && <div>{label}: </div>}
        {!label && <div>{leftArrow ? "↩" : "↪"}</div>}
        {children}
      </NavBladeInternalDiv>
    </NavBladeDiv>
  );
};

export function NavBladeButton<T extends { toString: () => string }>({
  label,
  selected,
  clickHandler,
  serialize,
}: {
  label: T;
  selected: T;
  clickHandler: Dispatch<SetStateAction<T>>;
  serialize?: (t: T) => string;
}) {
  const isSelected = label === selected;
  return (
    <NavBladeButtonDiv active={isSelected} onClick={() => clickHandler(label)}>
      [
      <NavBladeButtonLabel active={isSelected}>
        {serialize ? serialize(label) : label.toString().toLocaleLowerCase()}
      </NavBladeButtonLabel>
      ]
    </NavBladeButtonDiv>
  );
}
