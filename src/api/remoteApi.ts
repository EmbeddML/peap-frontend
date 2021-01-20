import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap, tap } from "rxjs/operators";
import { Party, Tweet, TwitterUser, Word } from "../models/model";
import { SentimentData, TopicData } from "../models/types";
import { Api } from "./api";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL!;

const ALL_USERS_LINK = `${BACKEND_API_URL}/user`;
const USER_LINK = (username: string) => `${ALL_USERS_LINK}/${username}`;
const USER_PHOTO_LINK = (username: string) => `${USER_LINK(username)}/photo`;
const USER_TOPICS_LINK = (username: string) => `${USER_LINK(username)}/topic`;
const USER_SENTIMENTS_LINK = (username: string) =>
  `${USER_LINK(username)}/sentiment`;
const USER_WORDS_LINK = (username: string, limit?: string) => {
  let link = `${USER_LINK(username)}/word?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};
const USER_TWEETS_LINK = (
  username: string,
  limit?: string,
  topic?: string,
  sentiment?: string
) => {
  let link = `${USER_LINK(username)}/tweets?`;
  link += limit ? `limit=${limit}&` : "";
  link += topic ? `topic=${topic}&` : "";
  link += sentiment ? `sentiment=${sentiment}&` : "";
  return link;
};

const ALL_PARTIES_LINK = `${BACKEND_API_URL}/party`;

const ALL_COALITIONS_LINK = `${BACKEND_API_URL}/coalitions`;

const TOPIC_LINK = (topic_id: string) => `${BACKEND_API_URL}/topic/${topic_id}`;
const TOPIC_SENTIMENTS_LINK = (topic_id: string) =>
  `${TOPIC_LINK(topic_id)}/sentiment`;
const TOPIC_WORDS_LINK = (topic_id: string, limit?: string) => {
  let link = `${TOPIC_LINK(topic_id)}/word?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};

export class RemoteApi implements Api {
  getAllParties(): Observable<Party[]> {
    return fromFetch(ALL_PARTIES_LINK).pipe(
      switchMap((response) => response.json()),
      map((parties: any[]) =>
        parties.map(
          (party) =>
            new Party(party["party_id"], party["name"], party["coalition"])
        )
      )
    );
  }
  getSentimentsForTopic(topic: string): Observable<SentimentData[]> {
    return fromFetch(TOPIC_SENTIMENTS_LINK(topic)).pipe(
      switchMap((response) => response.json()),
      map((sentiments: any[]) => sentiments as SentimentData[])
    );
  }

  getWordsForTopic(topic: string, limit?: string): Observable<Word[]> {
    return fromFetch(TOPIC_WORDS_LINK(topic, limit)).pipe(
      switchMap((response) => response.json()),
      map((words: any[]) => words as Word[])
    );
  }

  getTweetsForUser(
    username: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]> {
    return fromFetch(USER_TWEETS_LINK(username, limit, topic, sentiment)).pipe(
      switchMap((response) => response.json()),
      map((tweets: any[]) =>
        tweets.map((tweet) => {
          const linkSplit: string[] = tweet["twitter_link"].split("/");
          const id: string = linkSplit[linkSplit.length - 1];
          return new Tweet(
            id,
            tweet["twitter_link"],
            tweet["username"],
            tweet["tweet_text"],
            [tweet["topic"], tweet["topic_proba"]] as TopicData,
            tweet["sentiment"]
          );
        })
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
