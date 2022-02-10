import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex-grow: 1;
  align-items: flex-start;
  background-color: ${(props) => props.theme.PageContainer.backgroundColor};
  color: ${(props) => props.theme.PageContainer.color};
  margin-top: 8px;
  padding-bottom: 100px;
`;
