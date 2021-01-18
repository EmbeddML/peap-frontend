import React, { useState } from "react";
import Plot, { Figure } from "react-plotly.js";
import { TwitterUser } from "../../models/model";
import { DataFrame } from "data-forge";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Data } from "plotly.js";

interface TwitterPlotProps {
  twitterUsers: TwitterUser[];
  is_3D: boolean;
  clusteringProperty: string;
  selectedUsername?: string;
}

export const TwitterPlot = React.memo(
  ({
    twitterUsers,
    is_3D,
    clusteringProperty,
    selectedUsername = "",
  }: TwitterPlotProps) => {
    const df = new DataFrame(twitterUsers);

    let { path } = useRouteMatch();
    const history = useHistory();

    let selectedUser: TwitterUser | null = null;
    if (selectedUsername) {
      const df_user = df.where((user) => user.username === selectedUsername);
      if (df_user.count() > 0) {
        selectedUser = df_user.first();
      }
    }

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
            zeroline: false,
          },
          yaxis: {
            showgrid: false,
            showticklabels: false,
            title: { text: "" },
            showspikes: false,
            zeroline: false,
          },
          zaxis: {
            showgrid: false,
            showticklabels: false,
            title: { text: "" },
            showspikes: false,
            zeroline: false,
          },
          annotations: selectedUser
            ? [
                {
                  showarrow: false,
                  x: selectedUser.x_graph3d,
                  y: selectedUser.y_graph3d,
                  z: selectedUser.z_graph3d,
                  text: selectedUser.username,
                  xanchor: "left",
                  xshift: 40,
                  opacity: 1,
                },
              ]
            : [],
        },
      },
      frames: [],
    } as Readonly<Figure>);

    function onPlotlyClick(event: any) {
      const username = event.points[0].text;

      if (!selectedUser) {
        history.push(`${path}/${username}`);
      }
    }

    const unique_cluster_values = df
      .getSeries(clusteringProperty)
      .distinct()
      .toArray();

    // const availableSymbols = [
    //   "circle",
    //   "square",
    //   "diamond",
    //   "cross",
    //   "triangle",
    //   "pentagon",
    //   "hexagram",
    //   "star",
    //   "hourglass",
    //   "bowtie",
    //   "asterisk",
    //   "hash",
    // ];

    const plotData = unique_cluster_values.map((cluster_value, index) => {
      const df_f = df.where(
        (user) =>
          user[clusteringProperty as keyof TwitterUser] === cluster_value
      );
      const customdata = df_f
        .subset([
          "username",
          "name",
          "party",
          "coalition",
          "role",
          "tweets_count",
          "cluster_dbscan_id",
          "cluster_kmeans_id",
          "cluster_pam_id",
        ])
        .toRows();

      const usernames = df_f.getSeries("username").toArray();
      const symbols = usernames.map((username) =>
        username === selectedUsername ? "diamond" : "circle"
      );
      return {
        x: df_f.getSeries("x_graph3d").toArray(),
        y: df_f.getSeries("y_graph3d").toArray(),
        z: df_f.getSeries("z_graph3d").toArray(),
        text: usernames,
        customdata: customdata,
        type: "scatter3d",
        mode: "markers",
        showlegend: true,
        marker: {
          opacity: 1,
          // size: df_f.getSeries("tweets_count").toArray(),
          symbol: symbols,
        },
        name: cluster_value,
        hovertext: "",
        hovertemplate: `
          <b>%{customdata[0]}</b>
          <br>%{customdata[1]} 
          <br>%{customdata[2]}
          <br>%{customdata[3]}
          <br>%{customdata[4]}
          <extra></extra>`,
          // <br>%{customdata[5]}
        // <br>%{customdata[6]}
        // <br>%{customdata[7]}
        // <br>%{customdata[8]}
      } as Data;
    });

    return (
      <Plot
        onInitialized={(figure) => setPlotState(figure)}
        // onUpdate={(figure) => setPlotState(figure)}  // CAUSES INFINITE LOOP
        onClick={onPlotlyClick}
        data={plotData}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        layout={plotState.layout}
        frames={plotState.frames!}
      />
    );
  }
);
