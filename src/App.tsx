import { Grid } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import { Politicians } from "./components/Politicians";
import { MainBar } from "./components/core/MainBar";
import { Sidebar } from "./components/core/Sidebar";

const GridAppBar = styled(Grid)`
  flex: 0 0 auto;
`;

const GridContent = styled(Grid)`
  flex: 1 0 auto;
`;

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

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
        <ClickAwayListener onClickAway={handleSidebarClose}>
          <GridAppBar item>
            <MainBar handleSidebarOpen={handleSidebarOpen}></MainBar>
          </GridAppBar>
        </ClickAwayListener>

        <GridContent container>
          <Switch>
            <Route path="/politicians">
              <Politicians />
            </Route>
            <Redirect to="/politicians" />
          </Switch>
        </GridContent>
      </Grid>
      <Sidebar {...{ sidebarOpen, handleSidebarClose }}></Sidebar>
    </Router>
  );
}

export default App;
