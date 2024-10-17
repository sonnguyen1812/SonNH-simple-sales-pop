export default function timestampToDate(timestamp) {
  return new Date(
    (timestamp?._seconds + timestamp?._nanoseconds / 1000000000) * 1000
  ).toDateString();
}
