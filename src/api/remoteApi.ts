import { Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap } from "rxjs/operators";
import { TwitterUser } from "../models/model";
import { Sentiment, Topic } from "../models/types";
import { Api } from "./api";


const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL!;
const TWITTER_USERS_LINK = `${BACKEND_API_URL}/user`;
const TWITTER_POINTS_3D_LINK = `${BACKEND_API_URL}/point3d`;


export class RemoteApi implements Api {
  getSentimentsForUser(username: string): Observable<Sentiment[]> {
    throw new Error("Method not implemented.");
  }
  getTopicsForUser(username: string): Observable<Topic[]> {
    throw new Error("Method not implemented.");
  }
  getTwitterUser(username: string): Observable<TwitterUser | undefined> {
    throw new Error("Method not implemented.");
  }
  getAllTwitterUsers(): Observable<TwitterUser[]> {
    throw new Error("Method not implemented.");

    // return fromFetch(TWITTER_USERS_LINK).pipe(
    //   switchMap(response => response.json()),
    //   map((twitterUsers: any[]) => twitterUsers.map(user => new TwitterUser(user["twitter_name"], user["party"], user["coalition"]))),
    // )
  }
}
