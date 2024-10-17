import moment from 'moment';

export default function timestampToRelativeTime(timestamp) {
  const millisecond = timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6;
  const date = new Date(millisecond);
  return moment(date).fromNow();
}
