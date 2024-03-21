import * as cron from 'node-cron';

export default ({
  schedule_time = process.env.CRON_SCHEDULE,
  time_zone = `Asia / Bangkok`,
  task_action = () => {},
}: {
  schedule_time?: string;
  time_zone?: string;
  task_action?: any;
}) => {
  const task = cron.schedule(
    schedule_time,
    () => {
      // Your cron job logic here
      task_action();
    },
    {
      scheduled: true,
      time_zone, // Set the timezone for the cron job
    },
  );

  // Start the cron job
  task.start();
};
