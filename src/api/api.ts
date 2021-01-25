import { Observable } from "rxjs";
import { Coalition, Party, Tweet, TwitterUser, Word } from "../models/model";
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
  getTweetsForTopic(topic: string, limit?: string): Observable<Tweet[]>;
  getTopics(): Observable<string[]>;

  getAllParties(): Observable<Party[]>;
  getParty(partyId: string): Observable<Party | undefined>;
  getTopicsForParty(partyId: string): Observable<TopicData[]>;
  getSentimentsForParty(partyId: string): Observable<SentimentData[]>;
  getWordsForParty(partyId: string): Observable<Word[]>;
  getTweetsForParty(
    partyId: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]>;

  getAllCoalitions(): Observable<Coalition[]>;
  getCoalition(coalitionId: string): Observable<Coalition | undefined>;
  getTopicsForCoalition(coalitionId: string): Observable<TopicData[]>;
  getSentimentsForCoalition(coalitionId: string): Observable<SentimentData[]>;
  getWordsForCoalition(coalitionId: string): Observable<Word[]>;
  getTweetsForCoalition(
    coalitionId: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]>;

  getWebSocketClient(): Observable<WebSocket>;

}

export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();
