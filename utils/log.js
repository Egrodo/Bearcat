module.exports = (msg) => {
  const timestamp = new Date().toUTCString();
  console.log(`${msg} @ ${timestamp}`);
};
