import { useHistory, useParams, useRouteMatch } from "react-router-dom";
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
import {
  IconButton,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@material-ui/core";

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
  Topic,
}

export interface PoliticalFigureDetailProps {
  politicalFigureDetailType: PoliticalFigureDetailType;
  data?: TwitterUser[];
  clusteringProperty?: string;
  availableClusteringProperties?: [string, string][];
}

export function PoliticalFigureDetail({
  politicalFigureDetailType,
  data = [],
  clusteringProperty = "",
  availableClusteringProperties = [],
}: PoliticalFigureDetailProps) {
  const history = useHistory();
  let { path } = useRouteMatch();
  const { username, partyId, coalitionId, topicId } = useParams<{
    username: string;
    partyId: string;
    coalitionId: string;
    topicId: string;
  }>();
  const [dataCopy, setDataCopy] = useState<TwitterUser[] | undefined>(data);
  const [selectedUser, setSelectedUser] = useState<TwitterUser | null>();
  const [selectedParty, setSelectedParty] = useState<Party | null>();
  const [
    selectedCoalition,
    setSelectedCoalition,
  ] = useState<Coalition | null>();
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [wordsData, setWordsData] = useState<Word[]>([]);
  const [tweetsData, setTweetsData] = useState<Tweet[]>([]);
  const [chosenTopic, setChosenTopic] = useState<string>("");
  const [chosenSentiment, setChosenSentiment] = useState<string>("");

  useEffect(() => {
    if (selectedUser && !selectedUser.name) {
      const newData = Object.assign([], data)
      selectedUser.name = ""
      selectedUser.party = ""
      selectedUser.coalition = ""
      selectedUser.role = ""
      newData.push(selectedUser)
      setDataCopy(newData)
    }
  }, [data, selectedUser])

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
    } else if (topicId) {
      return api.getTweetsForTopic(topicId, "15");
    } else {
      return of([]);
    }
  }, [
    selectedUser,
    selectedParty,
    selectedCoalition,
    topicId,
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
    } else if (topicId) {
      forkJoin([
        api.getSentimentsForTopic(topicId),
        api.getWordsForTopic(topicId),
      ]).subscribe(([sentiments, words]) => {
        setSentimentData(sentiments);
        setWordsData(words);
      });
    }
  }, [username, partyId, coalitionId, topicId]);

  useEffect(() => {
    if (topicId) {
      api.getTopics().subscribe(setAllTopics);
    }
  }, [topicId]);

  useEffect(() => {
    setTweetsData([]);
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
                ? (selectedUser.name ? "Politician" : "Twitter user")
                : selectedParty
                ? "Party"
                : selectedCoalition
                ? "Coalition"
                : topicId
                ? "Topic"
                : ""}
            </Typography>
            {topicId && (
              <FormControl style={{marginLeft: "16px"}}>
                <Select
                  id="topic-select"
                  
                  value={topicId}
                  onChange={(event) => {
                    const value = event.target.value as string;
                    history.push(path.replace(":topicId", value));
                  }}
                >
                  {allTopics.map((topic) => (
                    <MenuItem key={topic} value={topic}>
                      {topic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
            xl={topicId ? 12 : 8}
          >
            {!topicId && (
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
            )}
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
            {!topicId && (
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
            )}
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
                      data={dataCopy as TwitterUser[]}
                      is_3D={true}
                      availableClusteringProperties={
                        availableClusteringProperties
                      }
                      initialClusteringProperty={clusteringProperty}
                      selectedUsername={username.toLowerCase()}
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
            xl={topicId ? 12 : 4}
          >
            <Grow in={true}>
              <StyledItem item xs={11} md={8} lg={6} xl={topicId ? 6 : 12}>
                <DynamicPaper elevation={1} style={{ position: "relative" }}>
                  {!chosenTopic && !topicId && (
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
                    {chosenTopic || topicId ? "Top" : "Random"} Tweets{" "}
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
