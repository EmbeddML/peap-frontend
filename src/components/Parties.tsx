import React, { useEffect, useState } from "react";
import { Party } from "../models/model";
import { api } from "../api/api";
import { TwitterPlot } from "./shared/TwitterPlot";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  PoliticalFigureDetail,
  PoliticalFigureDetailType,
} from "./PoliticalFigureDetail";

export function Parties() {
  let { path } = useRouteMatch();
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    api.getAllParties().subscribe(setParties);
  }, []);

  return (
    <Switch>
      <Route exact path={path}>
        <div>root</div>
        {/* <TwitterPlot
          data={twitterUsers}
          initialClusteringProperty={clusteringProperty}
          availableClusteringProperties={availableClusteringProperties}
        ></TwitterPlot> */}
      </Route>
      <Route path={`${path}/:partyId`}>
      <div>detail</div>
        {/* <PoliticalFigureDetail
          politicalFigureDetailType={PoliticalFigureDetailType.Party}
          data={parties}
        ></PoliticalFigureDetail> */}
      </Route>
    </Switch>
  );
}
