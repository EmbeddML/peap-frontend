import {
  createMuiTheme,
  Grid,
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { CssBaseline } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import styled, {ThemeProvider} from "styled-components";
import { Politicians } from "./components/Politicians";
import { MainBar } from "./components/core/MainBar";
import { Sidebar } from "./components/core/Sidebar";
import type from '@material-ui/lab/themeAugmentation';
import { About } from "./components/About";
import { Parties } from "./components/Parties";
import { Coalitions } from "./components/Coalitions";

const GridAppBar = styled(Grid)`
  flex: 0 0 auto;
`;

const GridContent = styled(Grid)`
  flex: 1 0 auto;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(8, 160, 233)",
    },
    contrastThreshold: 2,
    secondary: {
      main: "#0084b4",
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
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
                <Route path="/parties">
                  <Parties />
                </Route>
                <Route path="/coalitions">
                  <Coalitions />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Redirect to="/politicians" />
              </Switch>
            </GridContent>
          </Grid>
          <Sidebar {...{ sidebarOpen, handleSidebarClose }}></Sidebar>
        </Router>
      </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

export default App;
