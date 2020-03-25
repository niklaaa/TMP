export default function formatSeconds(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - 3600 * hours) / 60);

  let hoursString = "" + hours < 10 ? "0" + hours : hours;
  let minutesString = "" + minutes < 10 ? "0" + minutes : minutes;

  return hoursString + ":" + minutesString;
}
