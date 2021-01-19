import { DataFrame } from "data-forge";
import { Data } from "plotly.js";
import React, { useCallback, useEffect, useState } from "react";
import Plot, { Figure } from "react-plotly.js";
import { forkJoin, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { flatMap, mergeMap, map, tap } from "rxjs/operators";
import { api } from "../../api/api";
import { Word } from "../../models/model";
import { red, blue, lightGreen, purple, green, grey } from "@material-ui/core/colors/";

export enum BarPlotSubject {
  Default,
  Topic,
  Sentiment,
}

export type BarPlotData = [string, number];

export interface BarPlotProps {
  data: BarPlotData[];
  onColumnClick?: (label: string) => void;
  initialBarPlotSubject?: BarPlotSubject;
  initialSelectedColumn?: string;
}

export const BarPlot = ({
  data,
  onColumnClick = (_) => {},
  initialBarPlotSubject = BarPlotSubject.Default,
  initialSelectedColumn = "",
}: BarPlotProps) => {
  const [dataDf, setDataDf] = useState<DataFrame<BarPlotData>>(new DataFrame());

  const [wordsInTopics, setWordsInTopics] = useState<[string, number][][]>([]);
  const [bps, setBps] = useState<BarPlotSubject>(initialBarPlotSubject);
  const [selectedColumn, setSelectedColumn] = useState<string>(
    initialSelectedColumn
  );

  const internalOnColumnClick = useCallback(
    (event: any) => {
      let newSelectedColumn = event.points[0].label;
      if (newSelectedColumn === selectedColumn) {
        newSelectedColumn = "";
      }
      setSelectedColumn(newSelectedColumn);
      onColumnClick(newSelectedColumn);
    },
    [selectedColumn, onColumnClick]
  );

  useEffect(() => {
    const df = new DataFrame<BarPlotData>(data).renameSeries({
      "0": "label",
      "1": "value",
    }) as DataFrame<BarPlotData>;
    setDataDf(df);
  }, [data]);

  useEffect(() => {
    if (bps === BarPlotSubject.Topic) {
      const topicRequests: Observable<Word[]>[] = dataDf
        .getSeries("label")
        .distinct()
        .toArray()
        .map((topic: string) => api.getWordsForTopic(topic, "15"));
      forkJoin(topicRequests)
        .pipe(
          map(
            (topics: Word[][]) =>
              topics.map((topic) =>
                topic.map((word) => [word.text, word.value])
              ) as [string, number][][]
          )
        )
        .subscribe((wordsInTopics: [string, number][][]) => {
          setWordsInTopics(
            wordsInTopics.map((wordsInTopic) =>
              wordsInTopic.sort((a, b) => b[1] - a[1])
            )
          );
        });
    }
  }, [dataDf, bps]);

  const [plotState, setPlotState] = useState<Readonly<Figure>>({
    data: [],
    layout: {
      autosize: true,
      margin: { l: 32, r: 32, b: 24, t: 16, pad: 0 },
      barmode: "group",
      xaxis: {
        tickmode: "linear", // Show all labels
        fixedrange: true,
      },
      yaxis: {
        tickformat: ",.0%",
        fixedrange: true,
      },
      hovermode: "closest",
      showlegend: false,
    },
    frames: [],
  } as Readonly<Figure>);

  const [plotData, setPlotData] = useState<Data[]>([]);

  useEffect(() => {
    const x_arr = dataDf.getSeries("label").toArray();
    const y_arr = dataDf.getSeries("value").toArray();
    const text_arr = dataDf
      .getSeries("value")
      .toArray()
      .map((value: number) => (value * 100).toFixed(0) + "%");
    const customdata_arr = wordsInTopics;

    let marker = {};
    let highlightColors = [];
    let greyColors = Array(10).fill(grey[600]);
    if (bps === BarPlotSubject.Sentiment) {
      highlightColors = [red["A700"], blue["A700"], "#20b820", purple["A700"]];
    } else if (bps === BarPlotSubject.Topic) {
      highlightColors = Array(10).fill(blue["A400"])
    }

    const colorIndex  = x_arr.findIndex((value) => value === selectedColumn);
    if (colorIndex >= 0) {
      let colors = Object.assign([], highlightColors)
      highlightColors = greyColors;
      highlightColors[colorIndex] = colors[colorIndex]
    }
    marker = {
      color: highlightColors,
    };

    const newData = [
      {
        x: x_arr,
        y: y_arr,
        marker: marker,
        text: text_arr,
        textposition: "auto",
        type: "bar",
        customdata: bps === BarPlotSubject.Topic ? customdata_arr : [],
        hoverinfo: "y",
        hovertemplate:
          bps === BarPlotSubject.Topic
            ? `
        <b>Top ${15} words:</b>
        <br>%{customdata[0][0]}
        <br>%{customdata[1][0]}
        <br>%{customdata[2][0]}
        <br>%{customdata[3][0]}
        <br>%{customdata[4][0]}
        <br>%{customdata[5][0]}
        <br>%{customdata[6][0]}
        <br>%{customdata[7][0]}
        <br>%{customdata[8][0]}
        <br>%{customdata[9][0]}
        <br>%{customdata[10][0]}
        <br>%{customdata[11][0]}
        <br>%{customdata[12][0]}
        <br>%{customdata[13][0]}
        <br>%{customdata[14][0]}
        <extra></extra>`
            : ``,
      },
    ];

    setPlotData(newData as any);
  }, [dataDf, bps, wordsInTopics, selectedColumn]);

  return (
    <Plot
      onInitialized={(figure) => setPlotState(figure)}
      onClick={internalOnColumnClick}
      data={plotData}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
      layout={plotState.layout}
      frames={plotState.frames!}
    />
  );
};
