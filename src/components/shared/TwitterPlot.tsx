import React, { useEffect, useState } from "react";
import Plot, { Figure } from "react-plotly.js";
import { TwitterUser } from "../../models/model";
import { DataFrame } from "data-forge";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Data } from "plotly.js";

interface TwitterPlotProps {
  data: TwitterUser[];
  initialClusteringProperty: string;
  is_3D?: boolean;
  selectedUsername?: string;
}

export function TwitterPlot({
  data,
  initialClusteringProperty,
  is_3D = true,
  selectedUsername = "",
}: TwitterPlotProps) {
  let { path } = useRouteMatch();
  const history = useHistory();

  const [df, setDf] = useState<DataFrame<TwitterUser>>(new DataFrame());
  const [is3d, setIs3d] = useState<boolean>(is_3D);
  const [selectedUser, setSelectedUser] = useState<TwitterUser | null>(null);
  const [clusteringProperty, setClusteringProperty] = useState<string>(
    initialClusteringProperty
  );
  const [plotData, setPlotData] = useState<Data[]>([]);
  const [plotState, setPlotState] = useState<Readonly<Figure>>(
    {} as Readonly<Figure>
  );

  function onPlotlyClick(event: any) {
    console.log(event);
    const username = event.points[0].text;
    console.log(history);

    if (!selectedUser) {
      history.push(`${path}/${username}`);
    } else {
      history.goBack();
    }
  }

  useEffect(() => {
    setDf(new DataFrame(data));
  }, [data]);

  useEffect(() => {
    if (selectedUsername) {
      const df_user = df.where((user) => user.username === selectedUsername);
      if (df_user.count() > 0) {
        setSelectedUser(df_user.first());
      } else {
        setSelectedUser(null);
      }
    } else {
      setSelectedUser(null);
    }
  }, [df, selectedUsername]);

  useEffect(() => {
    const state = {
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
            // showgrid: false,
            showticklabels: false,
            title: { text: "" },
            // showspikes: false,
            zeroline: false,
          },
          yaxis: {
            // showgrid: false,
            showticklabels: false,
            title: { text: "" },
            // showspikes: false,
            zeroline: false,
          },
          zaxis: {
            // showgrid: false,
            showticklabels: false,
            title: { text: "" },
            // showspikes: false,
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
                  xshift: 20,
                  opacity: 1,
                },
              ]
            : [],
        },
      },
      frames: [],
    } as Readonly<Figure>;

    setPlotState(state);
  }, [selectedUser]);

  useEffect(() => {
    const unique_cluster_values = df
      .getSeries(clusteringProperty)
      .distinct()
      .toArray();

    const newPlotData = unique_cluster_values.map((cluster_value) => {
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
      const sizes = usernames.map((username) =>
        username === selectedUsername ? 30 : 15
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
          size: sizes,
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
      } as Data;
    });

    setPlotData(newPlotData);
  }, [df, clusteringProperty, selectedUsername]);

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
