import React from "react";
import ReactWordcloud, { MinMaxPair, Optional, Options } from "react-wordcloud";
import styled from "styled-components";
import { Word } from "../../models/model";

export interface WordCloudProps {
  words: Word[];
}

const StyledContainer = styled.div`
  flex: 1 1 auto;
`;

export function WordCloud({ words }: WordCloudProps) {
  const options: Optional<Options> = {
    rotations: 2,
    rotationAngles: [-90, 0] as MinMaxPair,
    deterministic: true,
    transitionDuration: 200,
    randomSeed: "42",
    enableOptimizations: true,
    padding: 2,
    scale: "log",
    fontSizes: [10, 60] as MinMaxPair
  };

  return (
    <StyledContainer>
      <ReactWordcloud words={words} options={options} />
    </StyledContainer>
  );
}
