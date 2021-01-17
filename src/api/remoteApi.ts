import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap } from "rxjs/operators";
import { Tweet, TwitterUser, Word } from "../models/model";
import { SentimentData, TopicData } from "../models/types";
import { Api } from "./api";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL!;

const ALL_USERS_LINK = `${BACKEND_API_URL}/user`;
const USER_LINK = (username: string) => `${ALL_USERS_LINK}/${username}`;
const USER_PHOTO_LINK = (username: string) => `${USER_LINK(username)}/photo`;
const USER_TOPICS_LINK = (username: string) => `${USER_LINK(username)}/topic`;
const USER_SENTIMENTS_LINK = (username: string) =>
  `${USER_LINK(username)}/sentiment`;
const USER_WORDS_LINK = (username: string) => `${USER_LINK(username)}/word`;
const USER_TWEETS_LINK = (
  username: string,
  limit?: string,
  topic?: string,
  sentiment?: string
) => {
  let link = `${USER_LINK(username)}/tweets/?`;
  link += limit ? `limit=${limit}&` : "";
  link += topic ? `topic=${topic}&` : "";
  link += sentiment ? `sentiment=${sentiment}&` : "";
  return link;
};


export class RemoteApi implements Api {
  getTweetsForUser(
    username: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]> {
    return fromFetch(USER_TWEETS_LINK(username, limit, topic, sentiment)).pipe(
      switchMap((response) => response.json()),
      map((tweets: any[]) =>
        tweets.map(
          (tweet) => {
            const linkSplit: string[] = tweet["twitter_link"].split('/')
            const id: string = linkSplit[linkSplit.length - 1]
            return new Tweet(
              id,
              tweet["twitter_link"],
              tweet["username"],
              tweet["tweet_text"],
              [tweet["topic"], tweet["topic_proba"]] as TopicData,
              tweet["sentiment"]
            )}
        ),
      )
    );
  }
  getWordsForUser(username: string): Observable<Word[]> {
    return fromFetch(USER_WORDS_LINK(username)).pipe(
      switchMap((response) => response.json()),
      map((words: any[]) => words as Word[])
    );
  }
  getSentimentsForUser(username: string): Observable<SentimentData[]> {
    return fromFetch(USER_SENTIMENTS_LINK(username)).pipe(
      switchMap((response) => response.json()),
      map((sentiments: any[]) => sentiments as SentimentData[])
    );
  }

  getTopicsForUser(username: string): Observable<TopicData[]> {
    return fromFetch(USER_TOPICS_LINK(username)).pipe(
      switchMap((response) => response.json()),
      map((topics: any[]) =>
        topics.map((obj: any) => [obj.topic, obj.part] as TopicData)
      )
    );
  }

  getTwitterUser(username: string): Observable<TwitterUser | undefined> {
    return fromFetch(USER_LINK(username)).pipe(
      switchMap((response) => response.json()),
      map(
        (user: any) =>
          new TwitterUser(
            user["username"],
            user["name"],
            user["party"],
            user["coalition"],
            user["role"],
            user["tweets_count"],
            user["x_graph2d"],
            user["y_graph2d"],
            user["x_graph3d"],
            user["y_graph3d"],
            user["z_graph3d"],
            user["cluster_dbscan_id"],
            user["cluster_kmeans_id"],
            user["cluster_pam_id"],
            ""
          )
      )
    );
  }

  getPhotoUrlForUser(username: string): Observable<string> {
    return fromFetch(USER_PHOTO_LINK(username)).pipe(
      switchMap((response) => response.json()),
      map((data: any) => data["url"])
    );
  }

  getAllTwitterUsers(): Observable<TwitterUser[]> {
    return fromFetch(ALL_USERS_LINK).pipe(
      switchMap((response) => response.json()),
      map((twitterUsers: any[]) =>
        twitterUsers.map(
          (user) =>
            new TwitterUser(
              user["username"],
              user["name"],
              user["party"],
              user["coalition"],
              user["role"],
              user["tweets_count"],
              user["x_graph2d"],
              user["y_graph2d"],
              user["x_graph3d"],
              user["y_graph3d"],
              user["z_graph3d"],
              user["cluster_dbscan_id"],
              user["cluster_kmeans_id"],
              user["cluster_pam_id"],
              ""
            )
        )
      )
    );
  }
}
