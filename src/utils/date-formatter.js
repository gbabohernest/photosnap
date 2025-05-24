import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

/**
 * formate dates in API responses.
 * Example: Joined: 1 day ago
 */
function dateFormatter(date) {
  return dayjs(date).fromNow();
}

export default dateFormatter;
