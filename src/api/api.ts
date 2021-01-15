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
  getTwitterUser(username: string): Observable<TwitterUser | undefined>;
  getTopicsForUser(username: string): Observable<[string, number][]>;
}

class RemoteApi implements Api {
  getTopicsForUser(username: string): Observable<[string, number][]> {
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

class DummyApi implements Api {
  public users: TwitterUser[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (value: number) =>
      new TwitterUser(
        "testPhoto" + value,
        "testUsername" + value,
        "testFirstname" + value,
        "testSurname" + value,
        "testParty" + value,
        "testCoalition" + value,
        "testRole" + value,
        Math.floor(5 + Math.random() * value) * 5,
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

  getTopicsForUser(username: string): Observable<[string, number][]> {
    return of(Array.from(Array(15).keys()).map(value => [value.toString(), Math.floor(5 + Math.random() * 40)]))
  }

  getTwitterUser(username: string): Observable<TwitterUser | undefined> {
    return of(this.users.find(user => user.username === username))
  }

  getAllTwitterUsers(): Observable<TwitterUser[]> {
    return of(this.users);
  }
}

export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();
