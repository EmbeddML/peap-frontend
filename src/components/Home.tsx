import {
  ButtonBase,
  Fade,
  Grid,
  Grow,
  Paper,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import TextsmsIcon from "@material-ui/icons/Textsms";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const StyledContainer = styled(Grid)`
  padding: 8px;
`;

const StyledItem = styled(Grid)`
  padding: 8px;
`;

const StyledButtonBase = styled(ButtonBase)`
  width: 100%;
  height: 100%;
`;

const StyledPaper = styled(Paper)`
  padding: 8px;
  width: 100%;
  height: 250px;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  :hover {
    background-color: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }
`;

class ExploreItem {
  constructor(
    public title: string,
    public text: string,
    public link: string,
    public icon: JSX.Element
  ) {}
}

const exploreItems = [
  new ExploreItem(
    "Politicians",
    "How does your favourite politican express himself? Find it out yourself!",
    "/politicians",
    <SupervisorAccountIcon color="primary" style={{ fontSize: 100 }} />
  ),
  new ExploreItem(
    "Parties",
    "There are some big fish out there. It's time to unravel their behaviour!",
    "/parties",
    <GroupWorkIcon color="primary" style={{ fontSize: 100 }} />
  ),
  new ExploreItem(
    "Coalitions",
    "Check how coalition as a whole is doing!",
    "/coalitions",
    <AccountTreeIcon color="primary" style={{ fontSize: 100 }} />
  ),
  new ExploreItem(
    "Topics",
    "Don't know what a particular topic is about? Check our in-depth analysis!",
    "/topics",
    <TextsmsIcon color="primary" style={{ fontSize: 100 }} />
  ),
  // new ExploreItem(
  //   "New Twitter account",
  //   "Want to know something more? Run all of our analyses on other Twitter accounts!",
  //   "/customUser",
  //   <PersonAddIcon color="primary" style={{ fontSize: 100 }} />
  // ),
];

export function Home() {
  const history = useHistory();

  return (
    <Fade in={true}>
      <Grid container direction="column" justify="center" alignItems="stretch" wrap="nowrap" style={{minHeight: "100%"}} xl={10} >
        <Grow in={true}>
          <Grid
            container
            direction="column"
            justify="center"
            style={{ marginTop: "16px", flex: "0 0 auto" }}
          >
            <Typography variant="h5" align="center">
              Hi!
            </Typography>
            <Typography variant="subtitle1" align="center">
              What's to explore?
            </Typography>
          </Grid>
        </Grow>

        <StyledContainer
          container
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center"
          wrap="wrap"
          spacing={0}
          xs={12}
          style={{ flex: "0 0 auto" }}
        >
          {exploreItems.map((exploreItem) => (
            <Grow in={true}>
              <StyledItem
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={exploreItem.title}
              >
                <StyledButtonBase>
                  <StyledPaper
                    elevation={1}
                    onClick={() => history.push(exploreItem.link)}
                  >
                    <Typography variant="h6" align="center">
                      {exploreItem.title}
                    </Typography>
                    <Grid
                      container
                      style={{ flex: "1 1 auto" }}
                      justify="center"
                      alignContent="center"
                    >
                      <Grid item>{exploreItem.icon}</Grid>
                    </Grid>
                    <Typography
                      variant="body1"
                      align="justify"
                      style={{ padding: "8px" }}
                    >
                      {exploreItem.text}
                    </Typography>
                  </StyledPaper>
                </StyledButtonBase>
              </StyledItem>
            </Grow>
          ))}
        </StyledContainer>
      </Grid>
    </Fade>
  );
}
