// Example using googleapis package
const { google } = require('googleapis');

async function addTaskToCalendar(task) {
    // TODO: implement Google Calendar API integration
    // Create event with task.title and task.deadline
    console.log(`Adding task "${task.title}" to Google Calendar`);
}

module.exports = { addTaskToCalendar };
