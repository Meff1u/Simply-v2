const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js'),
client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction],
});

const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const { connect } = require('mongoose');
(async () => {
    await connect(process.env.DB, {}).catch(console.error);
})();

client.commands = new Collection();

module.exports = client;

fs.readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);