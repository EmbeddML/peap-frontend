import React, { useEffect, useState } from "react";
import { TwitterUser } from "../models/model";
import { api } from "../api/api";
import { TwitterPlot } from "./shared/TwitterPlot";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PoliticalFigureDetail,
  PoliticalFigureDetailType,
} from "./shared/PoliticalFigureDetail";

export function Politicians() {
  let { path } = useRouteMatch();
  const [twitterUsers, setTwitterUsers] = useState<TwitterUser[]>([]);
  const [clusteringProperty, setClusteringProperty] = useState<string>(
    "cluster_kmeans_id"
  );

  const [
    availableClusteringProperties,
    setAvailableClusteringProperties,
  ] = useState<[string, string][]>([
    ["party", "Party"],
    ["coalition", "Coalition"],
    ["role", "Role"],
    ["cluster_dbscan_id", "Group assignment - DBSCAN"],
    ["cluster_kmeans_id", "Group assignment - K-Means"],
    ["cluster_pam_id", "Group assignment - GMM"],
  ]);

  useEffect(() => {
    api.getAllTwitterUsers().subscribe(setTwitterUsers);
  }, []);

  return (
    <Switch>
      <Route exact path={path}>
        <TwitterPlot
          data={twitterUsers}
          initialClusteringProperty={clusteringProperty}
          availableClusteringProperties={availableClusteringProperties}
        ></TwitterPlot>
      </Route>
      <Route path={`${path}/:username`}>
        <PoliticalFigureDetail
          politicalFigureDetailType={PoliticalFigureDetailType.Politician}
          data={twitterUsers}
          clusteringProperty={clusteringProperty}
          availableClusteringProperties={availableClusteringProperties}
        ></PoliticalFigureDetail>
      </Route>
    </Switch>
  );
}
