import { Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap } from "rxjs/operators";
import { TwitterUser } from "../models/model";

const USE_DUMMY_API = JSON.parse(process.env.REACT_APP_USE_DUMMY_API!);

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL!;
const TWITTER_USERS_LINK = `${BACKEND_API_URL}/user`;
const TWITTER_POINTS_3D_LINK = `${BACKEND_API_URL}/point3d`;

export interface Api {
  getAllTwitterUsers(): Observable<TwitterUser[]>;
}

class RemoteApi implements Api {
  getAllTwitterUsers(): Observable<TwitterUser[]> {
    throw new Error("Method not implemented.");

    // return fromFetch(TWITTER_USERS_LINK).pipe(
    //   switchMap(response => response.json()),
    //   map((twitterUsers: any[]) => twitterUsers.map(user => new TwitterUser(user["twitter_name"], user["party"], user["coalition"]))),
    // )
  }
}

class DummyApi implements Api {
  getAllTwitterUsers(): Observable<TwitterUser[]> {
    const users = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
      (value: number) =>
        new TwitterUser(
          "testPhoto" + value,
          "testUsername" + value,
          "testFirstname" + value,
          "testSurname" + value,
          "testParty" + value,
          "testCoalition" + value,
          "testRole" + value,
          value,
          value + Math.floor(Math.random() * 3),
          value + Math.floor(Math.random() * 3),
          value + Math.floor(Math.random() * 3),
          value + Math.floor(Math.random() * 3),
          value + Math.floor(Math.random() * 3),
          value % 3,
          value % 3,
          value % 3
        )
    );
    return of(users);
  }
}

export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();
