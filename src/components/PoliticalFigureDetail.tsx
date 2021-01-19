import { useParams } from "react-router-dom";
import { Fade, Grid, Paper, Typography, Grow } from "@material-ui/core";
import styled from "styled-components";
import { api } from "../api/api";
import { useCallback, useEffect, useState } from "react";
import { BarPlot, BarPlotSubject } from "./shared/BarPlot";
import { PoliticalFigureDescription } from "./shared/PoliticalFigureDescription";
import { SentimentData, TopicData } from "../models/types";
import { forkJoin } from "rxjs";
import { WordCloud } from "./shared/WordCloud";
import { Tweet, TwitterUser, Word } from "../models/model";
import { TwitterPlot } from "./shared/TwitterPlot";
import { TweetsList } from "./shared/TweetsList";
import { Refresh } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

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

const DynamicPaper = styled(StyledPaper)`
  height: auto;
`;

const PlotPaper = styled(StyledPaper)`
  height: 600px;
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
  const [selectedUser, setSelectedUser] = useState<TwitterUser | null>();
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [wordsData, setWordsData] = useState<Word[]>([]);
  const [tweetsData, setTweetsData] = useState<Tweet[]>([]);
  const [chosenTopic, setChosenTopic] = useState<string>("");
  const [chosenSentiment, setChosenSentiment] = useState<string>("");

  const refreshTweetsList = useCallback(() => {
    return api.getTweetsForUser(username, "5", chosenTopic, chosenSentiment);
  }, [username, chosenTopic, chosenSentiment]);

  useEffect(() => {
    forkJoin({
      user: api.getTwitterUser(username),
      userPhotoUrl: api.getPhotoUrlForUser(username),
      topics: api.getTopicsForUser(username),
      sentiments: api.getSentimentsForUser(username),
      words: api.getWordsForUser(username),
    }).subscribe(({ user, userPhotoUrl, topics, sentiments, words }) => {
      if (user) {
        user.photoUrl = userPhotoUrl;
        setSelectedUser(user);
      }
      setTopicData(topics);
      setSentimentData(sentiments);
      setWordsData(words);
    });
  }, [username]);

  useEffect(() => {
    refreshTweetsList().subscribe(setTweetsData);
  }, [refreshTweetsList]);


  function onTopicColumnClick(label: string) {
    setChosenTopic(label);
  }

  function onSentimentColumnClick(label: string) {
    setChosenSentiment(label);
  }



  return (
    <Fade in={true}>
      <Grid container>
        <StyledContainer
          container
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="flex-start"
          wrap="wrap"
          spacing={0}
          xl={8}
        >
          <Grow in={true}>
            <StyledItem item xs={11} md={6} xl={6}>
              <StyledPaper elevation={1}>
                <PoliticalFigureDescription
                  politicalFigureData={selectedUser as TwitterUser}
                ></PoliticalFigureDescription>
              </StyledPaper>
            </StyledItem>
          </Grow>
          <Grow in={true}>
            <StyledItem item xs={11} md={6} xl={6}>
              <StyledPaper elevation={1}>
                <Typography variant="h6" align="center">
                  Words analysis
                </Typography>
                <WordCloud words={wordsData}></WordCloud>
              </StyledPaper>
            </StyledItem>
          </Grow>
          <Grow in={true}>
            <StyledItem item xs={11} md={6} xl={6}>
              <StyledPaper elevation={1}>
                <Typography variant="h6" align="center">
                  Topic analysis
                </Typography>
                <BarPlot
                  data={topicData}
                  onColumnClick={onTopicColumnClick}
                  initialBarPlotSubject={BarPlotSubject.Topic}
                ></BarPlot>
              </StyledPaper>
            </StyledItem>
          </Grow>
          <Grow in={true}>
            <StyledItem item xs={11} md={6} xl={6}>
              <StyledPaper elevation={1}>
                <Typography variant="h6" align="center">
                  Sentiment analysis
                </Typography>
                <BarPlot
                  data={sentimentData}
                  onColumnClick={onSentimentColumnClick}
                  initialBarPlotSubject={BarPlotSubject.Sentiment}
                ></BarPlot>
              </StyledPaper>
            </StyledItem>
          </Grow>

          <Grow in={true}>
            <StyledItem item xs={11} md={12} lg={8} xl={12}>
              <PlotPaper elevation={1}>
                <Typography variant="h6" align="center">
                  Speech analysis
                </Typography>
                <TwitterPlot
                  data={twitterUsers}
                  is_3D={true}
                  initialClusteringProperty={clusteringProperty}
                  selectedUsername={username}
                ></TwitterPlot>
              </PlotPaper>
            </StyledItem>
          </Grow>
        </StyledContainer>
        <StyledContainer
          container
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="flex-start"
          wrap="wrap"
          spacing={0}
          xl={4}
        >
          <Grow in={true}>
            <StyledItem item xs={11} md={8} lg={6} xl={12}>
              <DynamicPaper elevation={1} style={{ position: "relative" }}>
                {!chosenTopic && <IconButton
                  aria-label="refresh"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => refreshTweetsList().subscribe(setTweetsData)}
                >
                  <Refresh fontSize="inherit" />
                </IconButton>}
                <Typography variant="h6" align="center">
                  {chosenTopic ? "Top" : "Random"} Tweets {chosenTopic || chosenSentiment ? "for (" : ""}{chosenTopic ? `Topic ${chosenTopic}` : ""}{chosenTopic && chosenSentiment ? `, ` : ""}{chosenSentiment ? `${chosenSentiment}` : ""}{chosenTopic || chosenSentiment ? ")" : ""}
                </Typography>
                <br></br>
                <TweetsList tweets={tweetsData} />
              </DynamicPaper>
            </StyledItem>
          </Grow>
        </StyledContainer>
      </Grid>
    </Fade>
  );
}
