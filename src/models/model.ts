import { Sentiment, Topic } from "./types";

export class TwitterUser {
  constructor(
    public username: string,
    public name: string,
    public party: string,
    public coalition: string,
    public role: string,
    public tweets_count: number,
    public x_graph2d: number,
    public y_graph2d: number,
    public x_graph3d: number,
    public y_graph3d: number,
    public z_graph3d: number,
    public cluster_dbscan_id: number,
    public cluster_kmeans_id: number,
    public cluster_pam_id: number
  ) {}
}

export class Tweet {
  constructor(
    public id: string,
    public tweetLink: string,
    public username: string,
    public tweetText: string,
    public topic: Topic,
    public sentiment: string
  ) {}
}

export class Party {
  constructor(
    public id: string,
    public name: string,
    public coalition: string
  ) {}
}

export class Coalition {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

export interface Word {
  text: string,
  value: number
}
