import {
  CssBaseline,
} from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Home } from "./components/Home";
import { MainBar } from "./components/MainBar";


function App() {
  return (
    <Router>
      <CssBaseline />

      <MainBar></MainBar>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
