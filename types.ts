type Answer = number | string;
type QA = { Q: string, A: Answer | Answer[] };
export type Card<T> = (input: T) => QA;

export type DeckBasic<T> = {
  title: string;
  count: number;
  cards: Card<T>[];
}

export type Deck<T> = DeckBasic<T> & {
  notes: T[];
}

export type TestState = "wait" | "review" | "result"

export type Test = {
  key: string;
  title: string;
  tasks: QA[];
  state: TestState;
  startTime: number;
  index: number;
  count: number;
  right: number;
  wrong: number;
}