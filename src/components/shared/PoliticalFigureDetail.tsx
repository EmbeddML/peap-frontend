import { useParams } from "react-router-dom";
import { Fade, Grid, Paper, Typography, Grow } from "@material-ui/core";
import styled from "styled-components";
import { api } from "../../api/api";
import { useCallback, useEffect, useState } from "react";
import { BarPlot, BarPlotSubject } from "./BarPlot";
import { PoliticalFigureDescription } from "./PoliticalFigureDescription";
import { SentimentData, TopicData } from "../../models/types";
import { forkJoin, of } from "rxjs";
import { WordCloud } from "./WordCloud";
import { Coalition, Party, Tweet, TwitterUser, Word } from "../../models/model";
import { TwitterPlot } from "./TwitterPlot";
import { TweetsList } from "./TweetsList";
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
  data?: TwitterUser[];
  clusteringProperty?: string;
  availableClusteringProperties?: string[];
}

export function PoliticalFigureDetail({
  politicalFigureDetailType,
  data = [],
  clusteringProperty = "",
  availableClusteringProperties = [],
}: PoliticalFigureDetailProps) {
  const { username, partyId, coalitionId } = useParams<{
    username: string;
    partyId: string;
    coalitionId: string;
  }>();
  const [selectedUser, setSelectedUser] = useState<TwitterUser | null>();
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [
    selectedCoalition,
    setSelectedCoalition,
  ] = useState<Coalition | null>();
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [wordsData, setWordsData] = useState<Word[]>([]);
  const [tweetsData, setTweetsData] = useState<Tweet[]>([]);
  const [chosenTopic, setChosenTopic] = useState<string>("");
  const [chosenSentiment, setChosenSentiment] = useState<string>("");

  const refreshTweetsList = useCallback(() => {
    if (selectedUser) {
      return api.getTweetsForUser(
        selectedUser.username,
        "5",
        chosenTopic,
        chosenSentiment
      );
    } else if (selectedParty) {
      return api.getTweetsForParty(
        selectedParty.id,
        "5",
        chosenTopic,
        chosenSentiment
      );
    } else if (selectedCoalition) {
      return api.getTweetsForCoalition(
        selectedCoalition.id,
        "5",
        chosenTopic,
        chosenSentiment
      );
    } else {
      return of([]);
    }
  }, [
    selectedUser,
    selectedParty,
    selectedCoalition,
    chosenTopic,
    chosenSentiment,
  ]);

  useEffect(() => {
    if (username) {
      forkJoin([
        api.getTwitterUser(username),
        api.getPhotoUrlForUser(username),
        api.getTopicsForUser(username),
        api.getSentimentsForUser(username),
        api.getWordsForUser(username),
      ]).subscribe(([user, userPhotoUrl, topics, sentiments, words]) => {
        if (user) {
          user.photoUrl = userPhotoUrl;
          setSelectedUser(user);
        }
        setTopicData(topics);
        setSentimentData(sentiments);
        setWordsData(words);
      });
    } else if (partyId) {
      forkJoin([
        api.getParty(partyId),
        api.getTopicsForParty(partyId),
        api.getSentimentsForParty(partyId),
        api.getWordsForParty(partyId),
      ]).subscribe(([party, topics, sentiments, words]) => {
        setSelectedParty(party);
        setTopicData(topics);
        setSentimentData(sentiments);
        setWordsData(words);
      });
    } else if (coalitionId) {
      forkJoin([
        api.getCoalition(coalitionId),
        api.getTopicsForCoalition(coalitionId),
        api.getSentimentsForCoalition(coalitionId),
        api.getWordsForCoalition(coalitionId),
      ]).subscribe(([coalition, topics, sentiments, words]) => {
        setSelectedCoalition(coalition);
        setTopicData(topics);
        setSentimentData(sentiments);
        setWordsData(words);
      });
    }
  }, [username, partyId, coalitionId]);

  useEffect(() => {
    setTweetsData([])
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
      <>
        <Grow in={true}>
          <Grid container justify="center" style={{ marginTop: "16px" }}>
            <Typography variant="h5" align="center">
              {selectedUser
                ? "Politician"
                : selectedParty
                ? "Party"
                : selectedCoalition
                ? "Coalition"
                : ""}
            </Typography>
          </Grid>
        </Grow>
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
                    politicalFigureData={
                      selectedUser
                        ? (selectedUser as TwitterUser)
                        : selectedParty
                        ? (selectedParty as Party)
                        : selectedCoalition
                        ? (selectedCoalition as Coalition)
                        : null
                    }
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

            {politicalFigureDetailType ===
              PoliticalFigureDetailType.Politician && (
              <Grow in={true}>
                <StyledItem item xs={11} md={11} lg={10} xl={12}>
                  <PlotPaper elevation={1}>
                    <Typography variant="h6" align="center">
                      Speech analysis
                    </Typography>
                    <TwitterPlot
                      data={data as TwitterUser[]}
                      is_3D={true}
                      availableClusteringProperties={
                        availableClusteringProperties
                      }
                      initialClusteringProperty={clusteringProperty}
                      selectedUsername={username}
                    ></TwitterPlot>
                  </PlotPaper>
                </StyledItem>
              </Grow>
            )}
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
                  {!chosenTopic && (
                    <IconButton
                      aria-label="refresh"
                      style={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => {
                        setTweetsData([]);
                        refreshTweetsList().subscribe(setTweetsData);
                      }}
                    >
                      <Refresh fontSize="inherit" />
                    </IconButton>
                  )}
                  <Typography variant="h6" align="center">
                    {chosenTopic ? "Top" : "Random"} Tweets{" "}
                    {chosenTopic || chosenSentiment ? "for (" : ""}
                    {chosenTopic ? `Topic ${chosenTopic}` : ""}
                    {chosenTopic && chosenSentiment ? `, ` : ""}
                    {chosenSentiment ? `${chosenSentiment}` : ""}
                    {chosenTopic || chosenSentiment ? ")" : ""}
                  </Typography>
                  <br></br>
                  <TweetsList tweets={tweetsData} />
                </DynamicPaper>
              </StyledItem>
            </Grow>
          </StyledContainer>
        </Grid>
      </>
    </Fade>
  );
}
