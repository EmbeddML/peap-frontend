import { Coalition, Party, TwitterUser } from "../../models/model";
import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";
import { Divider, Grid, Typography } from "@material-ui/core";

export interface PoliticalFigureDescriptionProps {
  politicalFigureData: TwitterUser | Party | Coalition | null;
}

const StyledAvatar = styled(Avatar)`
  width: 150px;
  height: 150px;
`;

export function PoliticalFigureDescription(
  props: PoliticalFigureDescriptionProps
) {
  function renderSwitch({
    politicalFigureData,
  }: PoliticalFigureDescriptionProps) {
    if (politicalFigureData instanceof TwitterUser) {
      return (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          wrap="nowrap"
          spacing={3}
        >
          <Grid item>
            <Typography variant="h6" align="center">
              Politician
            </Typography>
          </Grid>

          <Grid container justify="center">
            <StyledAvatar
              variant="square"
              alt="avatar"
              src="/static/images/avatar/1.jpg"
            >{politicalFigureData.username}</StyledAvatar>
          </Grid>
          <Grid item>
            <Divider variant="middle"></Divider>
          </Grid>
          <Grid container justify="center">
            <Grid container xs={11} sm={6} md={11} lg={6} justify="space-between" wrap="nowrap">
              <Grid item>
                <Typography variant="body1" align="left">
                  <b>Name:</b>
                </Typography>
                <Typography variant="body1" align="left">
                  <b>Party:</b>
                </Typography>
                <Typography variant="body1" align="left">
                  <b>Coalition:</b>
                </Typography>
                <Typography variant="body1" align="left">
                  <b>Role:</b>
                </Typography>
                <Typography variant="body1" align="left">
                  <b>Tweets count:</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" align="right">
                  {politicalFigureData.name}
                </Typography>
                <Typography variant="body1" align="right">
                  {politicalFigureData.party}
                </Typography>
                <Typography variant="body1" align="right">
                  {politicalFigureData.coalition}
                </Typography>
                <Typography variant="body1" align="right">
                  {politicalFigureData.role}
                </Typography>
                <Typography variant="body1" align="right">
                  {politicalFigureData.tweets_count}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (politicalFigureData instanceof Party) {
      return <h3>TODO</h3>;
    } else if (politicalFigureData instanceof Coalition) {
      return <h3>TODO</h3>;
    } else {
      return <h3>ILLEGAL ARGUMENT {typeof politicalFigureData}</h3>;
    }
  }

  return <>{renderSwitch(props)}</>;
}
