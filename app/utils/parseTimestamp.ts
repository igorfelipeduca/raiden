export const parseTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hoursString = hours < 10 ? `0${hours}` : hours;
  const minutesString = minutes < 10 ? `0${minutes}` : minutes;

  return `${hoursString}:${minutesString} ${hours > 12 ? "PM" : "AM"} - ${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
};
