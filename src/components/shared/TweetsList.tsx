import { Tweet } from "../../models/model";
import { Tweet as TweetComponent } from "react-twitter-widgets";
import { CircularProgress, Divider, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Fragment, useCallback, useEffect, useState } from "react";

const TweetContainer = styled(Grid)`
  flex: 1 1 auto;
`;

const StyledGrid = styled(Grid)`
  flex: 0 1 auto;
`;

export interface TweetsListProps {
  tweets: Tweet[];
}

export function TweetsList({ tweets }: TweetsListProps) {
  const tweetOptions = {
    align: "center",
    cards: "hidden",
    conversation: "none",
    // width: "100"
  };

  const [tweetsLoaded, setTweetsLoaded] = useState<boolean[]>([])

  const onTweetLoaded = useCallback((index: number) => {
    const newTweetsLoaded: boolean[] = Object.assign([], tweetsLoaded);
    newTweetsLoaded[index] = true
    setTweetsLoaded(newTweetsLoaded)
  }, [tweetsLoaded])


  useEffect(() => {
    setTweetsLoaded(tweets.map(() => false))
  }, [tweets])

  return (
    <StyledGrid
      container
      direction="column"
      justify="flex-start"
      alignContent="stretch"
      wrap="nowrap"
    >
      {(tweets.length === 0 || !tweetsLoaded.every((tweetStatus) => tweetStatus)) && <Grid container justify="center" style={{padding: "16px"}}><CircularProgress size={80}/></Grid>}
      {tweets.map((tweet: Tweet, index: number, arr: Tweet[]) => (
        <Fragment key={tweet.id.toString()}>
          {tweetsLoaded.every((tweetStatus) => tweetStatus) && <Grid container justify="space-around">
            <div></div>
            <Typography variant="body2" align="center">
              Topic: <b>{tweet.topic[0]} ({(tweet.topic[1] * 100).toFixed(0)}%)</b>
            </Typography>
            <Typography variant="body2" align="center">
              Sentiment: <b>{tweet.sentiment.toUpperCase()}</b>
            </Typography>
            <div></div>
          </Grid>}

          <TweetContainer item>
            <TweetComponent tweetId={tweet.id.toString()} onLoad={() => onTweetLoaded(index)} options={tweetOptions} />
          </TweetContainer>
          {arr.length - 1 !== index && tweetsLoaded.every((tweetStatus) => tweetStatus) && <Divider variant="middle"></Divider>}
          {tweetsLoaded.every((tweetStatus) => tweetStatus) && <br />}
        </Fragment>
      ))}
    </StyledGrid>
  );
}
