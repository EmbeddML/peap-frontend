import React, { useEffect, useState } from "react";
import { TwitterUser } from "../models/model";
import { api } from "../api/api";
import { TwitterPlot } from "./shared/TwitterPlot";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PoliticalFigureDetail,
  PoliticalFigureDetailType,
} from "./PoliticalFigureDetail";

export function Politicians() {
  let { path } = useRouteMatch();
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([]);
  const [clusteringProperty, setClusteringProperty] = useState<string>("cluster_kmeans_id");
  const [is3d, setIs3d] = useState<boolean>(true);

  useEffect(() => {
    api.getAllTwitterUsers().subscribe(setTwitterUsers);
  }, []);

  return (
      <Switch>
        <Route exact path={path}>
          <TwitterPlot
            twitterUsers={twitterUsers}
            is_3D={is3d}
            clusteringProperty={clusteringProperty}
          ></TwitterPlot>
        </Route>
        <Route path={`${path}/:username`}>
          <PoliticalFigureDetail
            politicalFigureDetailType={PoliticalFigureDetailType.Politician}
            twitterUsers={twitterUsers}
            is_3D={is3d}
            clusteringProperty={clusteringProperty}
          ></PoliticalFigureDetail>
        </Route>
      </Switch>
  );
}
