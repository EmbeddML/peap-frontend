import React, { useEffect, useState } from "react";
import { TwitterUser } from "../models/model";
import { api } from "../api/api";
import { TwitterPlot } from "./TwitterPlot";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PoliticianFigureDetail,
  PoliticianFigureDetailType,
} from "./PoliticianFigureDetail/PoliticianFigureDetail";

export function Politicians() {
  let { path } = useRouteMatch();
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([]);

  useEffect(() => {
    api.getAllTwitterUsers().subscribe(setTwitterUsers);
  }, []);

  return (
    <Switch>
      <Route exact path={path}>
        <TwitterPlot
          twitterUsers={twitterUsers}
          is_3D={true}
          clusteringType={"cluster_dbscan_id"}
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
