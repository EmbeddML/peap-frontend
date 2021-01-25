import { Coalition, Party, TwitterUser } from "../../models/model";
import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";
import { Divider, Grid, Typography } from "@material-ui/core";
import avatarParty0 from "../../assets/parties/0.png";
import avatarParty1 from "../../assets/parties/1.png";
import avatarParty2 from "../../assets/parties/2.png";
import avatarParty3 from "../../assets/parties/3.png";
import avatarParty4 from "../../assets/parties/4.png";
import avatarParty5 from "../../assets/parties/5.png";
import avatarParty6 from "../../assets/parties/6.png";
import avatarParty7 from "../../assets/parties/7.png";
import avatarParty8 from "../../assets/parties/8.png";
import avatarParty9 from "../../assets/parties/9.png";
import avatarParty10 from "../../assets/parties/10.png";
import avatarParty11 from "../../assets/parties/11.png";
import avatarParty12 from "../../assets/parties/12.png";
import avatarParty13 from "../../assets/parties/13.png";
import avatarParty14 from "../../assets/parties/14.png";
import avatarParty15 from "../../assets/parties/15.png";
import avatarParty16 from "../../assets/parties/16.png";
import avatarParty17 from "../../assets/parties/17.png";
import avatarParty18 from "../../assets/parties/18.png";

import avatarCoalition0 from "../../assets/coalitions/0.png";
import avatarCoalition1 from "../../assets/coalitions/1.png";
import avatarCoalition2 from "../../assets/coalitions/2.png";
import avatarCoalition3 from "../../assets/coalitions/3.png";
import avatarCoalition4 from "../../assets/coalitions/4.png";

const avatarsParties = [
  avatarParty0,
  avatarParty1,
  avatarParty2,
  avatarParty3,
  avatarParty4,
  avatarParty5,
  avatarParty6,
  avatarParty7,
  avatarParty8,
  avatarParty9,
  avatarParty10,
  avatarParty11,
  avatarParty12,
  avatarParty13,
  avatarParty14,
  avatarParty15,
  avatarParty16,
  avatarParty17,
  avatarParty18,
];

const avatarsCoalitions = [
  avatarCoalition0,
  avatarCoalition1,
  avatarCoalition2,
  avatarCoalition3,
  avatarCoalition4,
];

export interface PoliticalFigureDescriptionProps {
  politicalFigureData: TwitterUser | Party | Coalition | null;
  dense?: boolean;
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
    dense = false,
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
          {!dense && (
            <>
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
                    {politicalFigureData.name && (
                      <>
                        {" "}
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
                        </Typography>{" "}
                      </>
                    )}
                    <Typography variant="body1" align="left">
                      <b>{politicalFigureData.name ? "Tweets:" : "Gathered tweets"}</b>
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
            </>
          )}
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
          </Grid>

          <Grid container item justify="center">
            <StyledAvatar
              alt="avatar"
              src={avatarsParties[+politicalFigureData.id]}
              variant="rounded"
            >
              {politicalFigureData.name.substr(0, 7)}
            </StyledAvatar>
          </Grid>
          {!dense && (
            <>
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
                      <b>Name:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Coalition:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Politicians:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Tweets:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Most active politician:</b>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.name}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.coalition}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.politiciansCount}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.tweetsCount}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.mostActivePolitician.name} (
                      {(
                        (politicalFigureData.mostActivePolitician.tweets_count /
                          politicalFigureData.tweetsCount) *
                        100
                      ).toFixed(0)}
                      %)
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      );
    } else if (politicalFigureData instanceof Coalition) {
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
            <StyledAvatar
              alt="avatar"
              src={avatarsCoalitions[+politicalFigureData.id]}
              variant="rounded"
            >
              {politicalFigureData.name.substr(0, 7)}
            </StyledAvatar>
          </Grid>
          {!dense && (
            <>
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
                      <b>Name:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Parties:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Politicians:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Tweets:</b>
                    </Typography>
                    <Typography variant="body1" align="left">
                      <b>Most active politician:</b>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.name}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.partiesCount}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.politiciansCount}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.tweetsCount}
                    </Typography>
                    <Typography variant="body1" align="right">
                      {politicalFigureData.mostActivePolitician.name} (
                      {(
                        (politicalFigureData.mostActivePolitician.tweets_count /
                          politicalFigureData.tweetsCount) *
                        100
                      ).toFixed(0)}
                      %)
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      );
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
