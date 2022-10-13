const { ActivityType } = require('discord.js');
const client = require('../..');
const chalk = require('chalk');
const pg = require('../../package.json');
const guildcfg = require('../../schemas/guildcfg');
const mongoose = require('mongoose');

client.on('ready', async () => {
    const activities = [
        { name: `${client.guilds.cache.size} servers!`, type: ActivityType.Streaming },
        { name: `${client.users.cache.size} users!`, type: ActivityType.Streaming },
        { name: `Version: ${pg.version}`, type: ActivityType.Streaming },
    ];
    let i = 0;
    setInterval(() => {
        if (i >= activities.length) i = 0;
        client.user.setActivity(activities[i]);
        i++;
    }, 10000);
    console.log(chalk.greenBright(`${client.user.tag} is watchin' ${client.guilds.cache.size} guilds!`));

    client.guilds.cache.forEach(async (g) => {
        let guild = await guildcfg.findOne({ gid: g.id });
        if (!guild) {
            console.log(`Creating config for ${g.name}...`);
            guild = await new guildcfg({
                _id: mongoose.Types.ObjectId(),
                gid: g.id,
                lang: 'en',
            });

            await guild.save().catch(console.error);
            console.log('Done.');
        }
    });
});