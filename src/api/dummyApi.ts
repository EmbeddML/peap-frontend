import { Observable, of } from "rxjs";
import { Coalition, Party, Tweet, TwitterUser, Word } from "../models/model";
import { SentimentData, TopicData } from "../models/types";
import { Api } from "./api";

export class DummyApi implements Api {
  getTweetsForTopic(topic: string, limit?: string): Observable<Tweet[]> {
    throw new Error("Method not implemented.");
  }
  getTopics(): Observable<string[]> {
    throw new Error("Method not implemented.");
  }
  getParty(partyId: string): Observable<Party | undefined> {
    throw new Error("Method not implemented.");
  }
  getTopicsForParty(partyId: string): Observable<TopicData[]> {
    throw new Error("Method not implemented.");
  }
  getSentimentsForParty(partyId: string): Observable<SentimentData[]> {
    throw new Error("Method not implemented.");
  }
  getWordsForParty(partyId: string): Observable<Word[]> {
    throw new Error("Method not implemented.");
  }
  getTweetsForParty(partyId: string, limit?: string, topic?: string, sentiment?: string): Observable<Tweet[]> {
    throw new Error("Method not implemented.");
  }
  getAllCoalitions(): Observable<Coalition[]> {
    throw new Error("Method not implemented.");
  }
  getCoalition(coalitionId: string): Observable<Coalition | undefined> {
    throw new Error("Method not implemented.");
  }
  getTopicsForCoalition(coalitionId: string): Observable<TopicData[]> {
    throw new Error("Method not implemented.");
  }
  getSentimentsForCoalition(coalitionId: string): Observable<SentimentData[]> {
    throw new Error("Method not implemented.");
  }
  getWordsForCoalition(coalitionId: string): Observable<Word[]> {
    throw new Error("Method not implemented.");
  }
  getTweetsForCoalition(coalitionId: string, limit?: string, topic?: string, sentiment?: string): Observable<Tweet[]> {
    throw new Error("Method not implemented.");
  }
  getAllParties(): Observable<Party[]> {
    throw new Error("Method not implemented.");
  }
  getSentimentsForTopic(topic: string): Observable<SentimentData[]> {
    throw new Error("Method not implemented.");
  }
  getWordsForTopic(topic: string, limit?: string): Observable<Word[]> {
    throw new Error("Method not implemented.");
  }
  getPhotoUrlForUser(username: string): Observable<string> {
    throw new Error("Method not implemented.");
  }
  public users: TwitterUser[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (value: number) =>
      new TwitterUser(
        "testUsername" + value,
        "testName" + value,
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
        value % 3,
        ""
      )
  );

  getTweetsForUser(username: string): Observable<Tweet[]> {
    return of([
      {
        id: "403507374595399680",
        tweetLink:
          "https://twitter.com/krzysztofbosak/status/403507374595399680",
        username: "krzysztofbosak",
        tweetText:
          "@lewysierpowy Trudno zapłacić za coś, za co nie przedstawiono żadnych roszczeń. Czekamy na papiery od HGW.",
        topic: ["2", 0.5249956472920833],
        sentiment: "negative",
      },
      {
        id: "333685688065220608",
        tweetLink:
          "https://twitter.com/krzysztofbosak/status/333685688065220608",
        username: "krzysztofbosak",
        tweetText:
          '@pobozy Nie wiem czy "gorszy". Trzeba by się pospierać co to jest "dobra demokracja". I wziąć poprawkę na poprzedzające okoliczności.',
        topic: ["3", 0.275000009641284],
        sentiment: "negative",
      },
      {
        id: "380088584021098496",
        tweetLink:
          "https://twitter.com/krzysztofbosak/status/380088584021098496",
        username: "krzysztofbosak",
        tweetText:
          "@KosJzef Dla bandziorków to co piszę to elementarz nie wart nawet wspominania, nie łudźmy się.",
        topic: ["0", 0.1],
        sentiment: "negative",
      },
      {
        id: "448232347134353408",
        tweetLink:
          "https://twitter.com/krzysztofbosak/status/448232347134353408",
        username: "krzysztofbosak",
        tweetText:
          "@jacekleski Na ile mi wiadomo, cały czas jest praktykującym katolikiem. Niemniej tt to chyba nie miejsce na religijne lustracje.",
        topic: ["5",0.5249969239811266],
        sentiment: "negative",
      },
      {
        id: "1037656057194205184",
        tweetLink:
          "https://twitter.com/krzysztofbosak/status/1037656057194205184",
        username: "krzysztofbosak",
        tweetText:
          "@SchwertnerPL @UdSC_gov_pl Na nagraniu widać pobicie 2 Polaków przez 4 Czeczenów a następnie pogoń za dziewczynką próbującą ich rozdzielić. Nagranie jest zbyt nieostre by rozstrzygnąć czy chłopiec miał coś w ręce. Dziewczynka zeznała że miał nóż",
        topic: ["0", 0.30999937409572426],
        sentiment: "negative",
      },
    ] as Tweet[]);
  }

  getWordsForUser(username: string): Observable<Word[]> {
    const wordsCount = Math.floor(50 + Math.random() * 40);
    return of(
      Array(wordsCount)
        .fill(0)
        .map(
          (_) =>
            ({
              text: Math.random().toString(36).substring(7),
              value: Math.floor(15 + Math.random() * 1000),
            } as Word)
        )
    );
  }
  getSentimentsForUser(username: string): Observable<SentimentData[]> {
    return of(
      ["negative", "neutral", "positive", "ambiguous"].map((value) => [
        value,
        Math.floor(5 + Math.random() * 40),
      ])
    );
  }

  getTopicsForUser(username: string): Observable<TopicData[]> {
    return of(
      Array.from(Array(10).keys()).map((value) => [
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
