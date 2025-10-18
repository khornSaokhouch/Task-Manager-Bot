const LocalSession = require('telegraf-session-local');

const localSession = new LocalSession({
    database: 'sessions_db.json', // stores session per user
    property: 'session',          // accessible via ctx.session
});

module.exports = localSession.middleware();
