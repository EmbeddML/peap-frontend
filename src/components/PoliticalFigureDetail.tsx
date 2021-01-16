import { useParams } from "react-router-dom";
import { Fade, Grid, Paper, Typography, Grow } from "@material-ui/core";
import styled from "styled-components";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { BarPlot } from "./shared/BarPlot";
import { Sentiment, Topic } from "../models/types";
import { forkJoin } from "rxjs";

const StyledContainer = styled(Grid)`
  padding: 8px;
`;

const StyledItem = styled(Grid)`
  padding: 8px;
`;

const StyledPaper = styled(Paper)`
  padding: 8px;
  height: 400px;
  display: flex;
  flex-flow: column nowrap;
`;

export enum PoliticalFigureDetailType {
  Politician,
  Party,
  Coalition,
}

export interface PoliticalFigureDetailProps {
  politicalFigureDetailType: PoliticalFigureDetailType;
}

export function PoliticalFigureDetail({
  politicalFigureDetailType,
}: PoliticalFigureDetailProps) {
  const { username } = useParams<{ username: string }>();

  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [sentimentData, setSentimentData] = useState<Sentiment[]>([]);

  function onTopicColumnClick(event: Readonly<Plotly.PlotMouseEvent>) {
    console.log(event);
  }

  function onSentimentColumnClick(event: Readonly<Plotly.PlotMouseEvent>) {
    console.log(event);
  }

  useEffect(() => {
    forkJoin({
      topics: api.getTopicsForUser(username),
      sentiments: api.getSentimentsForUser(username)
    })
    .subscribe(({topics, sentiments}) => {
      setTopicData(topics);
      setSentimentData(sentiments)
    });
  }, [username]);

  return (
    <Fade in={true}>
      <StyledContainer
        container
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="flex-start"
        wrap="wrap"
        spacing={0}
      >
        <Grow in={true}>
          <StyledItem item xs={12} sm={6} lg={4}>
            <StyledPaper elevation={1}>
              <Typography variant="h6" align="center">
                Topic analysis
              </Typography>
              <BarPlot plotData={topicData} onColumnClick={onTopicColumnClick}></BarPlot>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} sm={6} lg={4}>
            <StyledPaper elevation={1}>
              <Typography variant="h6" align="center">
                Sentiment analysis
              </Typography>
              <BarPlot {...{ plotData: sentimentData }} onColumnClick={onSentimentColumnClick}></BarPlot>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6}>
            <StyledPaper elevation={1}>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6}>
            <StyledPaper elevation={1}>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6}>
            <StyledPaper elevation={1}>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
            </StyledPaper>
          </StyledItem>
        </Grow>
      </StyledContainer>
    </Fade>
  );
}