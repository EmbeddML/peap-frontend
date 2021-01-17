import { Tweet } from "../../models/model";
import { Tweet as TweetComponent } from "react-twitter-widgets";
import { Divider, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";

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
    // cards: "hidden",
    conversation: "none",
    // width: "100"
  };

  return (
    <StyledGrid
      container
      direction="column"
      justify="flex-start"
      alignContent="stretch"
      wrap="nowrap"
    >
      {tweets.map((tweet: Tweet, index: number, arr: Tweet[]) => (
        <>
          <Grid container justify="space-around">
            <div></div>
            <Typography variant="body2" align="center">
              Topic: <b>{tweet.topic[0]}</b>
            </Typography>
            <Typography variant="body2" align="center">
              Sentiment: <b>{tweet.sentiment.toUpperCase()}</b>
            </Typography>
            <div></div>
          </Grid>

          <TweetContainer item>
            <TweetComponent tweetId={tweet.id} options={tweetOptions} />
          </TweetContainer>
          {arr.length - 1 !== index && <Divider variant="middle"></Divider>}
          <br />
        </>
      ))}
    </StyledGrid>
  );
}
