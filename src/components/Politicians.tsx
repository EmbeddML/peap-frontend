import React, { useEffect, useState } from "react";
import { TwitterPoint3D, TwitterUser } from "../models/model";
import { api } from "../api/api";
import { forkJoin } from "rxjs";
import { TwitterPlot } from "./TwitterPlot";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import { PoliticianDetail } from "./PoliticianDetail";

export function Politicians() {
  let { path, url } = useRouteMatch();
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
        {/* <Link to={`${url}/ble`}>Blle</Link> */}
        <TwitterPlot
          twitterUsers={twitterUsers}
          twitterPoints={twitterPoints}
          is_3D={true}
        ></TwitterPlot>
      </Route>
      <Route path={`${path}/:username`}>
        <PoliticianDetail></PoliticianDetail>
      </Route>
    </Switch>
  );
}
