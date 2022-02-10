import styled from "styled-components";

export const ThinColumnLayout = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(4, 1fr);
  @media only screen and (max-width: 1365px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 1148px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
  width: 100%;
`;

// https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
// Uses grid to generate a layout, assumes elements will compute how many rows they need
export const ThinPseudoMasonryLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 4px;
  width: 100%;
  @media only screen and (max-width: 1365px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 1148px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const WideColumnLayout = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(3, 1fr);
  @media only screen and (max-width: 1600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 1100px) {
    grid-template-columns: repeat(1, 1fr);
  }
  width: 100%;
`;
