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
          spacing={1}
        >
          <Grid item>
            <Typography variant="h6" align="center">
              {politicalFigureData.name}
            </Typography>
          </Grid>

          <Grid container item justify="center">
            <StyledAvatar alt="avatar" src={politicalFigureData.photoUrl}>
              {politicalFigureData.username}
            </StyledAvatar>
          </Grid>
          <Grid item>
            <Divider variant="middle"></Divider>
          </Grid>
          <Grid container item justify="center">
            <Grid
              container
              item
              xs={11}
              sm={8}
              md={11}
              lg={10}
              justify="space-between"
              wrap="nowrap"
            >
              <Grid item>
                <Typography variant="body1" align="left">
                  <b>Username:</b>
                </Typography>
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
                  <b>Overall tweets:</b>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" align="right">
                  {politicalFigureData.username}
                </Typography>
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
      return (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          wrap="nowrap"
          spacing={1}
        >
          <Grid item>
            <Typography variant="h6" align="center">
              {politicalFigureData.name}
            </Typography>
            <Typography variant="body1" align="center">
              {politicalFigureData.coalition}
            </Typography>
          </Grid>

          <Grid container item justify="center">
            <StyledAvatar alt="avatar" src={politicalFigureData.name}>
              {politicalFigureData.name[0]}
            </StyledAvatar>
          </Grid>
        </Grid>
      );
    } else if (politicalFigureData instanceof Coalition) {
      return <h3>TODO</h3>;
    } else {
      return (
        <Typography variant="h6" align="center">
          Political figure
        </Typography>
      );
    }
  }

  return <>{renderSwitch(props)}</>;
}
