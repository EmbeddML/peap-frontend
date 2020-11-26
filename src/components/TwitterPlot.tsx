import React from "react";
import Plot from "react-plotly.js";
import { TwitterPoint2D, TwitterPoint3D, TwitterUser } from "../models/model";
import { DataFrame } from 'data-forge';

interface TwitterPlotProps {
  twitterUsers: TwitterUser[];
  twitterPoints: TwitterPoint3D[] | TwitterPoint2D[];
  is_3D: boolean;
}

export function TwitterPlot({
  twitterUsers,
  twitterPoints,
  is_3D,
}: TwitterPlotProps) {

  const df_tu = new DataFrame(twitterUsers)
  const df_tp = new DataFrame(twitterPoints)
  const df = df_tu.join(df_tp, left => left.twitterName, right => right.twitterName, (left, right) => {
    return {
      twitterName: left.twitterName,
      party: left.party,
      coalition: left.coalition,
      x: right.x,
      y: right.y,
      z: is_3D ? right.z : 0
    }
  })

  df.bake()

  return (
    <Plot
      data={[
        {
          x: df.getSeries("x").toArray(),
          y: df.getSeries("y").toArray(),
          z: df.getSeries("z").toArray(),
          type: "scatter3d",
        },
      ]}
      style={{width: "100%", height: "100%"}}
      useResizeHandler
      layout={{autosize: true}}
    />
  );
}
