import { forkJoin, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { map, switchMap, tap } from "rxjs/operators";
import { Coalition, Party, Tweet, TwitterUser, Word } from "../models/model";
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
const PARTY_LINK = (partyId: string) => `${ALL_PARTIES_LINK}/${partyId}`;
const PARTY_TOPICS_LINK = (partyId: string) => `${PARTY_LINK(partyId)}/topic`;
const PARTY_SENTIMENTS_LINK = (partyId: string) =>
  `${PARTY_LINK(partyId)}/sentiment`;
const PARTY_WORDS_LINK = (partyId: string, limit?: string) => {
  let link = `${PARTY_LINK(partyId)}/word?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};
const PARTY_TWEETS_LINK = (
  partyId: string,
  limit?: string,
  topic?: string,
  sentiment?: string
) => {
  let link = `${PARTY_LINK(partyId)}/tweets?`;
  link += limit ? `limit=${limit}&` : "";
  link += topic ? `topic=${topic}&` : "";
  link += sentiment ? `sentiment=${sentiment}&` : "";
  return link;
};

const ALL_COALITIONS_LINK = `${BACKEND_API_URL}/coalition`;
const COALITION_LINK = (coalitionId: string) =>
  `${ALL_COALITIONS_LINK}/${coalitionId}`;
const COALITION_TOPICS_LINK = (coalitionId: string) =>
  `${COALITION_LINK(coalitionId)}/topic`;
const COALITION_SENTIMENTS_LINK = (coalitionId: string) =>
  `${COALITION_LINK(coalitionId)}/sentiment`;
const COALITION_WORDS_LINK = (coalitionId: string, limit?: string) => {
  let link = `${COALITION_LINK(coalitionId)}/word?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};
const COALITION_TWEETS_LINK = (
  coalitionId: string,
  limit?: string,
  topic?: string,
  sentiment?: string
) => {
  let link = `${COALITION_LINK(coalitionId)}/tweets?`;
  link += limit ? `limit=${limit}&` : "";
  link += topic ? `topic=${topic}&` : "";
  link += sentiment ? `sentiment=${sentiment}&` : "";
  return link;
};

const ALL_TOPICS_LINK = `${BACKEND_API_URL}/topic`;
const TOPIC_LINK = (topic_id: string) => `${ALL_TOPICS_LINK}/${topic_id}`;
const TOPIC_SENTIMENTS_LINK = (topic_id: string) =>
  `${TOPIC_LINK(topic_id)}/sentiment`;
const TOPIC_WORDS_LINK = (topic_id: string, limit?: string) => {
  let link = `${TOPIC_LINK(topic_id)}/word?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};
const TOPIC_TWEETS_LINK = (topic_id: string, limit?: string) => {
  let link = `${TOPIC_LINK(topic_id)}/tweets?`;
  link += limit ? `limit=${limit}&` : "";
  return link;
};

export class RemoteApi implements Api {

  //==========================PARTIES================================

  getParty(partyId: string): Observable<Party | undefined> {
    const politicians = this.getAllTwitterUsers();
    const party = fromFetch(PARTY_LINK(partyId)).pipe(
      switchMap((response) => response.json()),
      map(
        (party: any) =>
          new Party(party["party_id"], party["name"], party["coalition"])
      )
    );

    return forkJoin([politicians, party]).pipe(
      map(([politicians, party]) => {
        const partyPoliticians = politicians.filter(politician => politician.party === party.name)
        party.tweetsCount = partyPoliticians.map(politician => politician.tweets_count).reduce((prevCount, currCount) => prevCount + currCount)
        party.politiciansCount = partyPoliticians.length
        party.mostActivePolitician = partyPoliticians.sort((a, b) => b.tweets_count - a.tweets_count)[0]

        return party;
      })
    );
  }
  getWordsForParty(partyId: string): Observable<Word[]> {
    return fromFetch(PARTY_WORDS_LINK(partyId)).pipe(
      switchMap((response) => response.json()),
      map((words: any[]) => words as Word[])
    );
  }
  getSentimentsForParty(partyId: string): Observable<SentimentData[]> {
    return fromFetch(PARTY_SENTIMENTS_LINK(partyId)).pipe(
      switchMap((response) => response.json()),
      map((sentiments: any[]) => sentiments as SentimentData[])
    );
  }

  getTopicsForParty(partyId: string): Observable<TopicData[]> {
    return fromFetch(PARTY_TOPICS_LINK(partyId)).pipe(
      switchMap((response) => response.json()),
      map((topics: any[]) =>
        topics.map((obj: any) => [obj.topic, obj.part] as TopicData)
      )
    );
  }
  getTweetsForParty(
    partyId: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]> {
    return fromFetch(PARTY_TWEETS_LINK(partyId, limit, topic, sentiment)).pipe(
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

  //==========================COALITIONS================================

  getCoalition(coalitionId: string): Observable<Coalition | undefined> {
    const parties = this.getAllParties();
    const politicians = this.getAllTwitterUsers();
    const coalition = fromFetch(COALITION_LINK(coalitionId)).pipe(
      switchMap((response) => response.json()),
      map(
        (coalition: any) =>
          new Coalition(coalition["coalition_id"], coalition["name"])
      )
    );

    return forkJoin([politicians, parties, coalition]).pipe(
      map(([politicians, parties, coalition]) => {
        const coalitionPoliticians = politicians.filter(politician => politician.coalition === coalition.name)
        const coalitionParties = parties.filter(party => party.coalition === coalition.name)
        coalition.tweetsCount = coalitionPoliticians.map(politician => politician.tweets_count).reduce((prevCount, currCount) => prevCount + currCount)
        coalition.politiciansCount = coalitionPoliticians.length
        coalition.mostActivePolitician = coalitionPoliticians.sort((a, b) => b.tweets_count - a.tweets_count)[0]
        coalition.partiesCount = coalitionParties.length

        return coalition;
      })
    );
  }
  getWordsForCoalition(coalitionId: string): Observable<Word[]> {
    return fromFetch(COALITION_WORDS_LINK(coalitionId)).pipe(
      switchMap((response) => response.json()),
      map((words: any[]) => words as Word[])
    );
  }
  getSentimentsForCoalition(coalitionId: string): Observable<SentimentData[]> {
    return fromFetch(COALITION_SENTIMENTS_LINK(coalitionId)).pipe(
      switchMap((response) => response.json()),
      map((sentiments: any[]) => sentiments as SentimentData[])
    );
  }

  getTopicsForCoalition(coalitionId: string): Observable<TopicData[]> {
    return fromFetch(COALITION_TOPICS_LINK(coalitionId)).pipe(
      switchMap((response) => response.json()),
      map((topics: any[]) =>
        topics.map((obj: any) => [obj.topic, obj.part] as TopicData)
      )
    );
  }
  getTweetsForCoalition(
    coalitionId: string,
    limit?: string,
    topic?: string,
    sentiment?: string
  ): Observable<Tweet[]> {
    return fromFetch(
      COALITION_TWEETS_LINK(coalitionId, limit, topic, sentiment)
    ).pipe(
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
  getAllCoalitions(): Observable<Coalition[]> {
    return fromFetch(ALL_COALITIONS_LINK).pipe(
      switchMap((response) => response.json()),
      map((coalitions: any[]) =>
        coalitions.map(
          (coalition) =>
            new Coalition(coalition["coalition_id"], coalition["name"])
        )
      )
    );
  }

  //==========================TOPICS================================

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

  getTweetsForTopic(topic: string, limit?: string): Observable<Tweet[]> {
    return fromFetch(TOPIC_TWEETS_LINK(topic, limit)).pipe(
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

  getTopics(): Observable<string[]> {
    return fromFetch(ALL_TOPICS_LINK).pipe(
      switchMap((response) => response.json()),
      map((topics: any[]) => topics as string[])
    )
  }

  //==========================USER================================

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
