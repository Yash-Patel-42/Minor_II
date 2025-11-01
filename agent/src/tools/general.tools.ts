export const findCurrenttime = () => {
  const currentTime = new Date().toUTCString();
  console.log(currentTime);
  return currentTime;
};
