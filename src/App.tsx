import { Grid } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import { Home } from "./components/Home";
import { MainBar } from "./components/MainBar";

const GridAppBar = styled(Grid)`
  flex: 0 0 auto
`;

const GridContent = styled(Grid)`
  flex: 1 0 auto
`;


function App() {
  return (
    <Router>
      <CssBaseline />
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        wrap="nowrap"
        spacing={0}
      >
        <GridAppBar item>
          <MainBar></MainBar>
        </GridAppBar>
        <GridContent item>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Redirect to="/" />
          </Switch>
        </GridContent>
      </Grid>
    </Router>
  );
}

export default App;
