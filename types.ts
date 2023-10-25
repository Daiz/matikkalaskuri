type Answer = number | string;
type QA = { Q: string, A: Answer | Answer[] };
export type Card<T> = (input: T) => QA;

type InputType = "text" | "tel";

export type DeckBasic<T> = {
  title: string;
  inputType?: InputType;
  baseTime: number;
  count: number;
  cards: Card<T>[];
}

export type Deck<T> = DeckBasic<T> & {
  notes: T[];
}

export type TestState = "wait" | "review" | "result"

export type Test = {
  key: string;
  deck: Deck<any>;
  tasks: QA[];
  state: TestState;
  grade: number;
  startTime: number;
  endTime: number | null;
  index: number;
  right: number;
  wrong: number;
}