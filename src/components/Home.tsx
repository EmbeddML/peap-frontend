import React, { useEffect, useState } from "react";
import { TwitterPoint3D, TwitterUser } from "../models/model";
import { api } from "../api/api";
import { forkJoin, merge } from "rxjs";
import { TwitterPlot } from "./TwitterPlot";

export function Home() {
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
    <TwitterPlot
      twitterUsers={twitterUsers}
      twitterPoints={twitterPoints}
      is_3D={true}
    ></TwitterPlot>
  );
}
