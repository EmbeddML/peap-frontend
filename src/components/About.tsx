import {
  Avatar,
  Fade,
  Grid,
  Typography,
  Grow,
  Tooltip,
} from "@material-ui/core";
import styled from "styled-components";
import filip from "../assets/creators/filip.png";
import kacper from "../assets/creators/kacper.png";
import piotrek from "../assets/creators/piotrek.png";
import szymon from "../assets/creators/szymon.png";

const StyledContainer = styled(Grid)`
  padding: 16px;
  height: 100%;
  position: relative;
`;

const StyledAvatar = styled(Avatar)`
  width: 150px;
  height: 150px;
`;

const StyledProfileItem = styled(Grid)`
  margin-top: 16px;
  margin-left: 64px;
  margin-right: 64px;
  margin-bottom: 16px;
`;

const profileData: [string, string][] = [
  ["Filip Dratwiński", filip],
  ["Piotr Gramacki", piotrek],
  ["Kacper Leśniara", kacper],
  ["Szymon Woźniak", szymon],
];

function Profile({ data, index }: { data: [string, string]; index: number }) {
  return (
    <StyledProfileItem item>
      <Grow timeout={200 + 200 * index} in style={{ transformOrigin: "0 0 0" }}>
        <Grid container direction="column" alignItems="center" wrap="nowrap">
          <Grid item>
            <StyledAvatar src={data[1]} variant="circular"></StyledAvatar>
          </Grid>
          <Grid item style={{ marginTop: "8px" }}>
            <Typography variant="h6" align="center">
              {data[0]}
            </Typography>
          </Grid>
        </Grid>
      </Grow>
    </StyledProfileItem>
  );
}

export function About() {
  return (
    <Fade in timeout={800}>
      <StyledContainer
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        wrap="nowrap"
        spacing={0}
      >
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          wrap="nowrap"
          style={{ marginBottom: "32px", height: "100%" }}
        >
          <Grid item>
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              Creators
            </Typography>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignContent="flex-start"
          >
            {profileData.map((data, index) => (
              <Profile data={data} index={index}></Profile>
            ))}
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle1"
              align="center"
              style={{ marginTop: "16px" }}
            >
              Contact: <a href="mailto:embedd.ml@gmail.com">embedd.ml@gmail.com</a>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          style={{ padding: "16px", paddingBottom: "32px" }}
        >
          <Typography variant="subtitle1" align="center">
            Icon credits:
          </Typography>
          <Typography variant="caption" align="center">
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/nhor-phai"
              title="Nhor Phai"
            >
              Nhor Phai
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </Typography>
          <Typography variant="caption" align="center">
            By Source,{" "}
            <a
              href="//en.wikipedia.org/wiki/File:United_Right_Poland_logo.png"
              title="Fair use of copyrighted material in the context of United Right (Poland)"
            >
              Fair use
            </a>
            ,{" "}
            <a href="https://en.wikipedia.org/w/index.php?curid=61589654">
              Link
            </a>
          </Typography>
          <Typography variant="caption" align="center">
            By Komitet Wyborczy Sojuszu Lewicy Demokratycznej -
            lewica2019.pl/dla-mediow,{" "}
            <a
              href="http://creativecommons.org/publicdomain/zero/1.0/deed.en"
              title="Creative Commons Zero, Public Domain Dedication"
            >
              CC0
            </a>
            ,{" "}
            <a href="https://commons.wikimedia.org/w/index.php?curid=81602922">
              Link
            </a>
          </Typography>
        </Grid>
        <Grid
          container
          style={{ position: "absolute", bottom: "0", left: "0" }}
          justify="center"
          spacing={0}
        >
          <Typography variant="caption" align="center">
            Made for Social Media Analysis at{" "}
            <a href="http://pwr.edu.pl/en/">WUST</a> with{" "}
            <Tooltip title="xD">
              <span>❤️</span>
            </Tooltip>
          </Typography>
        </Grid>
      </StyledContainer>
    </Fade>
  );
}
