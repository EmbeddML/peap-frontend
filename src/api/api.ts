import { Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap } from "rxjs/operators";
import { TwitterUser } from "../models/model";
import { Sentiment, Topic } from "../models/types";
import { DummyApi } from "./dummyApi";
import { RemoteApi } from "./remoteApi";

const USE_DUMMY_API = JSON.parse(process.env.REACT_APP_USE_DUMMY_API!);

export interface Api {
  getAllTwitterUsers(): Observable<TwitterUser[]>;
  getTwitterUser(username: string): Observable<TwitterUser | undefined>;
  getTopicsForUser(username: string): Observable<Topic[]>;
  getSentimentsForUser(username: string): Observable<Sentiment[]>;
}


export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();