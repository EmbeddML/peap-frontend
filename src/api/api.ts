import { Observable } from "rxjs";
import { Tweet, TwitterUser, Word } from "../models/model";
import { SentimentData, TopicData } from "../models/types";
import { DummyApi } from "./dummyApi";
import { RemoteApi } from "./remoteApi";

const USE_DUMMY_API = JSON.parse(process.env.REACT_APP_USE_DUMMY_API!);

export interface Api {
  getAllTwitterUsers(): Observable<TwitterUser[]>;
  getTwitterUser(username: string): Observable<TwitterUser | undefined>;
  getTopicsForUser(username: string): Observable<TopicData[]>;
  getSentimentsForUser(username: string): Observable<SentimentData[]>;
  getWordsForUser(username: string): Observable<Word[]>;
  getTweetsForUser(
    username: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]>;
  getPhotoUrlForUser(username: string): Observable<string>;

  getWordsForTopic(topic: string, limit?: string): Observable<Word[]>;
  getSentimentsForTopic(topic: string): Observable<SentimentData[]>;

}

export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();
