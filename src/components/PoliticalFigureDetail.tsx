import { useParams } from "react-router-dom";
import { Fade, Grid, Paper, Typography, Grow } from "@material-ui/core";
import styled from "styled-components";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { BarPlot, BarPlotType } from "./shared/BarPlot";
import { PoliticalFigureDescription } from "./shared/PoliticalFigureDescription";
import { Sentiment, Topic } from "../models/types";
import { forkJoin } from "rxjs";
import { WordCloud } from "./shared/WordCloud";
import { TwitterUser, Word } from "../models/model";
import { TwitterPlot } from "./shared/TwitterPlot";
import { DataFrame } from "data-forge";

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
  overflow: hidden;
`;

export enum PoliticalFigureDetailType {
  Politician,
  Party,
  Coalition,
}

export interface PoliticalFigureDetailProps {
  politicalFigureDetailType: PoliticalFigureDetailType;
  twitterUsers: TwitterUser[];
  is_3D: boolean;
  clusteringProperty: string;
}

export function PoliticalFigureDetail({
  politicalFigureDetailType,
  twitterUsers,
  is_3D,
  clusteringProperty,
}: PoliticalFigureDetailProps) {
  const { username } = useParams<{ username: string }>();

  const df = new DataFrame(twitterUsers);
  let selectedUser: TwitterUser | null = null
    if (username) {
      const df_user = df.where(user => user.username === username)
      if (df_user.count() > 0) {
        selectedUser = df_user.first()
      }
    }

  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [sentimentData, setSentimentData] = useState<Sentiment[]>([]);
  const [wordsData, setWordsData] = useState<Word[]>([]);

  function onTopicColumnClick(event: Readonly<Plotly.PlotMouseEvent>) {
    console.log(event);
  }

  function onSentimentColumnClick(event: Readonly<Plotly.PlotMouseEvent>) {
    console.log(event);
  }

  useEffect(() => {
    forkJoin({
      topics: api.getTopicsForUser(username),
      sentiments: api.getSentimentsForUser(username),
      words: api.getWordsForUser(username),
    }).subscribe(({ topics, sentiments, words }) => {
      setTopicData(topics);
      setSentimentData(sentiments);
      setWordsData(words);
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
          <StyledItem item xs={12} md={6} xl={4}>
            <StyledPaper elevation={1}>
              <PoliticalFigureDescription politicalFigureData={selectedUser as TwitterUser}></PoliticalFigureDescription>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6} xl={4}>
            <StyledPaper elevation={1}>
              <Typography variant="h6" align="center">
                Topic analysis
              </Typography>
              <BarPlot
                plotData={topicData}
                onColumnClick={onTopicColumnClick}
                barPlotType={BarPlotType.Topic}
              ></BarPlot>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6} xl={4}>
            <StyledPaper elevation={1}>
              <Typography variant="h6" align="center">
                Sentiment analysis
              </Typography>
              <BarPlot
                plotData={sentimentData}
                onColumnClick={onSentimentColumnClick}
                barPlotType={BarPlotType.Sentiment}
              ></BarPlot>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12} md={6} xl={4}>
            <StyledPaper elevation={1}>
              <Typography variant="h6" align="center">
                Words analysis
              </Typography>
              <WordCloud words={wordsData}></WordCloud>
            </StyledPaper>
          </StyledItem>
        </Grow>
        <Grow in={true}>
          <StyledItem item xs={12}>
            <StyledPaper elevation={1}>
              <TwitterPlot
                twitterUsers={twitterUsers}
                is_3D={true}
                clusteringProperty={"cluster_dbscan_id"}
                selectedUsername={username}
              ></TwitterPlot>
            </StyledPaper>
          </StyledItem>
        </Grow>
      </StyledContainer>
    </Fade>
  );
}
