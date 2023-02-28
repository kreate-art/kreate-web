type UnixTimestampInMilliseconds = number;

type BaseMessage = {
  id: number;
  createdAt: UnixTimestampInMilliseconds;
};

export type Message = BaseMessage &
  (
    | { type: "string"; body: string } //
    | { type: "node"; body: React.ReactNode }
  );
