import moment from "moment";

export function convertDateAsDateIso(date: number) {
  return moment(date).format("YYYY-MM-DD");
}
