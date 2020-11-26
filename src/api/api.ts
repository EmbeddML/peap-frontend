import { Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap } from "rxjs/operators";
import { TwitterPoint2D, TwitterPoint3D, TwitterUser } from "../models/model"

// const BACKEND_API_URL = "http://192.168.0.214";
const BACKEND_API_URL = "https://politician-analysis-backend.herokuapp.com";
const TWITTER_USERS_LINK = `${BACKEND_API_URL}/user`;
const TWITTER_POINTS_3D_LINK = `${BACKEND_API_URL}/point3d`;


const USE_DUMMY_API = false;

export interface Api {
  getTwitterPoints3D(): Observable<TwitterPoint3D[]>;
  getTwitterPoints2D(): Observable<TwitterPoint2D[]>;
  getAllTwitterUsers(): Observable<TwitterUser[]>;
}

class RemoteApi implements Api {
    getTwitterPoints3D(): Observable<TwitterPoint3D[]> {
      return fromFetch(TWITTER_POINTS_3D_LINK).pipe(
        switchMap(response => response.json()),
        map((twitterPoints: any[]) => twitterPoints.map(point => new TwitterPoint3D(point["twitter_name"], point["x"], point["y"], point["z"]))),
        )
    }
    getTwitterPoints2D(): Observable<TwitterPoint2D[]> {
        throw new Error("Method not implemented.");
    }
    getAllTwitterUsers(): Observable<TwitterUser[]> {
      return fromFetch(TWITTER_USERS_LINK).pipe(
        switchMap(response => response.json()),
        map((twitterUsers: any[]) => twitterUsers.map(user => new TwitterUser(user["twitter_name"], user["party"], user["coalition"]))),
      )
    }

}

class DummyApi implements Api {
  getTwitterPoints3D(): Observable<TwitterPoint3D[]> {
    return of([new TwitterPoint3D("name1", 1, 2, 3), new TwitterPoint3D("name2", 2, 3, 4), new TwitterPoint3D("name3", 3, 4, 5)]);
  }
  getTwitterPoints2D(): Observable<TwitterPoint2D[]> {
      throw new Error("Method not implemented.");
  }
  getAllTwitterUsers(): Observable<TwitterUser[]> {
      return of([new TwitterUser("name1", "party1", "coalition1"), new TwitterUser("name2", "party2", "coalition2"), new TwitterUser("name3", "party3", "coalition3")])
  }
}


export const api: Api = USE_DUMMY_API ? new DummyApi() : new RemoteApi();
