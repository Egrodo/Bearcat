export default (timeToDelay: number) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
