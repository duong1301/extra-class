import cron from 'node-cron';

export const helloWorldSchedule = cron.schedule("* * * * * *", () => {
    console.log("Hello World");
}, {
    scheduled: false,
    timezone: "Asia/Ho_Chi_Minh",
});


