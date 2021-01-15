import React, { useEffect, useState } from "react";
import { TwitterPoint3D, TwitterUser } from "../models/model";
import { api } from "../api/api";
import { forkJoin } from "rxjs";
import { TwitterPlot } from "./TwitterPlot";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PoliticianFigureDetail,
  PoliticianFigureDetailType,
} from "./PoliticianFigureDetail";

export function Politicians() {
  let { path } = useRouteMatch();
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([]);
  const [twitterPoints, setTwitterPoints] = useState<TwitterPoint3D[]>([]);

  useEffect(() => {
    forkJoin({
      tu: api.getAllTwitterUsers(),
      tp: api.getTwitterPoints3D(),
    }).subscribe(({ tu, tp }) => {
      setTwitterUsers(tu);
      setTwitterPoints(tp);
    });
  }, []);

  return (
    <Switch>
      <Route exact path={path}>
        <TwitterPlot
          twitterUsers={twitterUsers}
          twitterPoints={twitterPoints}
          is_3D={true}
        ></TwitterPlot>
      </Route>
      <Route path={`${path}/:username`}>
        <PoliticianFigureDetail
          politicianFigureDetailType={PoliticianFigureDetailType.Politician}
        ></PoliticianFigureDetail>
      </Route>
    </Switch>
  );
}
