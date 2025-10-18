const Member = require('../models/Member');

module.exports = (bot) => {
    bot.start(async (ctx) => {
        const telegramId = ctx.from.id.toString();
        const username = ctx.from.username;
        const name = ctx.from.first_name + (ctx.from.last_name ? ' ' + ctx.from.last_name : '');
        if (!username) return ctx.reply('⚠️ Please set a Telegram username.');

        const member = await Member.findOne({ username });
        if (member) {
            if (!member.telegramId) {
                member.telegramId = telegramId;
                await member.save();
                ctx.reply('✅ Telegram ID linked.');
            } else {
                ctx.reply(`✅ Welcome back, ${name}!`);
            }
        } else {
            ctx.reply('⚠️ You are not registered. Ask admin to register.');
        }
    });

    bot.command('register', async (ctx) => {
        const telegramId = ctx.from.id.toString();
        const username = ctx.from.username;
        const name = ctx.from.first_name + (ctx.from.last_name ? ' ' + ctx.from.last_name : '');

        if (!username) return ctx.reply('⚠️ Please set a Telegram username.');

        let member = await Member.findOne({ username });
        if (member) return ctx.reply(`✅ Already registered, ${name}.`);

        member = new Member({ telegramId, username, name, role: 'Member', points: 0, level: 1 });
        await member.save();
        ctx.reply(`✅ Welcome ${name}! Registered as member.`);
    });
};
