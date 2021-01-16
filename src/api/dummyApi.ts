import { Observable, of } from "rxjs";
import { TwitterUser } from "../models/model";
import { Sentiment, Topic } from "../models/types";
import { Api } from "./api";

export class DummyApi implements Api {
  getWordsForUser(username: string): Observable<Sentiment[]> {
    throw new Error("Method not implemented.");
  }
  getSentimentsForUser(username: string): Observable<Sentiment[]> {
    return of(
      ["negative", "neutral", "positive", "ambiguous"].map((value) => [
        value,
        Math.floor(5 + Math.random() * 40),
      ])
    );
  }

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

  getTopicsForUser(username: string): Observable<Topic[]> {
    return of(
      Array.from(Array(15).keys()).map((value) => [
        value.toString(),
        Math.floor(5 + Math.random() * 40),
      ])
    );
  }

  getTwitterUser(username: string): Observable<TwitterUser | undefined> {
    return of(this.users.find((user) => user.username === username));
  }

  getAllTwitterUsers(): Observable<TwitterUser[]> {
    return of(this.users);
  }
}
