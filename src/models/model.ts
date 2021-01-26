import { TopicData } from "./types";

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
    public cluster_mean_shift_id: number,
    public cluster_kmeans_id: number,
    public cluster_gmm_id: number,
    public photoUrl: string
  ) {}
}

export class Tweet {
  constructor(
    public id: string,
    public tweetLink: string,
    public username: string,
    public tweetText: string,
    public topic: TopicData,
    public sentiment: string
  ) {}
}

export class Party {
  constructor(
    public id: string,
    public name: string,
    public coalition: string,
    public politiciansCount: number = 0,
    public tweetsCount: number = 0,
    public mostActivePolitician: TwitterUser = {} as TwitterUser
  ) {}
}


export class Coalition {
  constructor(
    public id: string,
    public name: string,
    public politiciansCount: number = 0,
    public tweetsCount: number = 0,
    public mostActivePolitician: TwitterUser = {} as TwitterUser,
    public partiesCount: number = 0,
  ) {}
}

export interface Word {
  text: string,
  value: number
}

export enum Sentiment {
  negative,
  neutral,
  positive,
  ambiguous
}
