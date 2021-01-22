import React from "react";
import ReactWordcloud, { MinMaxPair, Optional, Options } from "react-wordcloud";
import styled from "styled-components";
import { Word } from "../../models/model";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

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
    scale: "sqrt",
    fontSizes: [13, 40] as MinMaxPair,
  };

  
  return (
    <StyledContainer>
      <ReactWordcloud words={words.map(word => {
        word.value = Math.floor(word.value);
        return word
      })} options={options} />
    </StyledContainer>
  );
}
