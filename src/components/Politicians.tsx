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
  ] = useState<string[]>([
    "party",
    "coalition",
    "role",
    "cluster_dbscan_id",
    "cluster_kmeans_id",
    "cluster_pam_id",
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
