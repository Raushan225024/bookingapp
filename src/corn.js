const cron = require("node-cron");
const Locker = require("./models/locker");

cron.schedule("* * * * *", async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  await Locker.updateMany(
    {
      status: "tempLock",
      updatedAt: { $lte: fiveMinutesAgo }
    },
    {
      status: "available"
    }
  );
});