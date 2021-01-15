import { DataFrame } from "data-forge";
import React, { useState } from "react";
import Plot, { Figure } from "react-plotly.js";

interface BarPlotProps {
  topicData: [string, number][];
}

export const BarPlot = ({ topicData }: BarPlotProps) => {
  const df = new DataFrame(topicData).renameSeries({'0': "topic", '1': "value"});

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
        dtick: 1
      }
    },
    frames: [],
  } as Readonly<Figure>);

  function onColumnClick(event: any) {
    console.log(event);
  }

  return (
    <Plot
      onInitialized={(figure) => setPlotState(figure)}
      // onUpdate={(figure) => setPlotState(figure)}  // CAUSES INFINITE LOOP
      onClick={onColumnClick}
      data={[
        {
          x: df.getSeries("topic").toArray(),
          y: df.getSeries("value").toArray(),
          type: "bar"
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
