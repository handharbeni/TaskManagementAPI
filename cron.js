// cron.js  
const cron = require('node-cron');
const reminderService = require('./service/reminderService');

// Schedule a job to run every minute  
cron.schedule('* * * * *', () => {
    console.log('Checking for reminders...');
    reminderService.sendReminders()
        .then(() => console.log('Reminders checked successfully.'))
        .catch(err => console.error('Error checking reminders:', err));
});