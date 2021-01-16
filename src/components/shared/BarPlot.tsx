import { DataFrame } from "data-forge";
import React, { useState } from "react";
import Plot, { Figure } from "react-plotly.js";

export enum BarPlotType {
  Default,
  Topic,
  Sentiment,
}

export type BarPlotData = [string, number];

export interface BarPlotProps {
  plotData: BarPlotData[];
  onColumnClick?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  barPlotType?: BarPlotType;
  customData?: {};
}

export const BarPlot = ({
  plotData,
  onColumnClick = () => {},
  barPlotType = BarPlotType.Default,
  customData = {},
}: BarPlotProps) => {
  const df = new DataFrame(plotData).renameSeries({
    "0": "label",
    "1": "value",
  });

  const [plotState, setPlotState] = useState<Readonly<Figure>>({
    data: [],
    layout: {
      // legend: {
      //   x: 1,
      //   xanchor: "right",
      //   y: 1,
      // },
      autosize: true,
      margin: { l: 32, r: 32, b: 24, t: 16, pad: 0 },
      xaxis: {
        tickmode: "linear", // Show all labels
      },
      hovermode: "closest",
    },
    frames: [],
  } as Readonly<Figure>);

  const marker =
    barPlotType === BarPlotType.Sentiment
      ? {
          color: ["#dd1d1d", "#2257e7", "#20b820", "#9c08f1"],
        }
      : barPlotType === BarPlotType.Topic
      ? {}
      : {};

  return (
    <Plot
      onInitialized={(figure) => setPlotState(figure)}
      // onUpdate={(figure) => setPlotState(figure)}  // CAUSES INFINITE LOOP
      onClick={onColumnClick}
      data={[
        {
          x: df.getSeries("label").toArray(),
          y: df.getSeries("value").toArray(),
          marker: marker,
          type: "bar",
        },
      ]}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      layout={plotState.layout}
      frames={plotState.frames!}
    />
  );
};
