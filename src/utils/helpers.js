const moment = require('moment');

// Format date nicely
function formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
}

// Calculate remaining time until deadline
function timeRemaining(deadline) {
    const now = new Date();
    const diff = deadline - now; // milliseconds
    if(diff <= 0) return 'Deadline passed';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m remaining`;
}

// Simple logger
function logAction(action, details = '') {
    console.log(`[${new Date().toISOString()}] ${action} ${details}`);
}

module.exports = { formatDate, timeRemaining, logAction };
