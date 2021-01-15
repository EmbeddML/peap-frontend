import React, { useState } from "react";
import Plot, { Figure } from "react-plotly.js";
import { TwitterUser } from "../models/model";
import { DataFrame } from "data-forge";
import { useHistory, useRouteMatch } from "react-router-dom";

interface TwitterPlotProps {
  twitterUsers: TwitterUser[];
  is_3D: boolean;
}

export const TwitterPlot = React.memo(
  ({ twitterUsers, is_3D }: TwitterPlotProps) => {
    const df = new DataFrame(twitterUsers);

    let { path } = useRouteMatch();
    const history = useHistory();

    const [plotState, setPlotState] = useState<Readonly<Figure>>({
      data: [],
      layout: {
        legend: {
          x: 1,
          xanchor: "right",
          y: 1,
        },
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        scene: {
          xaxis: {
            showgrid: false,
            showticklabels: false,
            title: { text: "" },
            showspikes: false,
          },
          yaxis: {
            showgrid: false,
            showticklabels: false,
            title: { text: "" },
            showspikes: false,
          },
          zaxis: {
            showgrid: false,
            showticklabels: false,
            title: { text: "" },
            showspikes: false,
          },
        },
      },
      frames: [],
    } as Readonly<Figure>);

    function onPlotlyClick(event: any) {
      const username = event.points[0].customdata
      history.push(`${path}/${username}`);
    }

    const unique_cluster_ids = df
      .getSeries("cluster_dbscan_id")
      .distinct()
      .toArray();

    const plotData = unique_cluster_ids.map((cluster_id) => {
      const df_f = df.where((user) => user.cluster_dbscan_id === cluster_id)
      
      return {
        x: df_f.getSeries("x_graph3d").toArray(),
        y: df_f.getSeries("y_graph3d").toArray(),
        z: df_f.getSeries("z_graph3d").toArray(),
        customdata: df_f.getSeries("username").toArray(),
        type: "scatter3d",
        mode: "markers",
        showlegend: true,
        name: `Cluster ${cluster_id}`,
      };
    });

    return (
      <Plot
        onInitialized={(figure) => setPlotState(figure)}
        // onUpdate={(figure) => setPlotState(figure)}  // CAUSES INFINITE LOOP
        onClick={onPlotlyClick}
        data={plotData as any[]}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        layout={plotState.layout}
        frames={plotState.frames!}
      />
    );
  }
);
