const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns my latency.'),
    ephemeral: true,
    category: 'info',
    permPower: 0,
    logable: false,
    async execute(interaction) {
        await interaction.followUp({ content: `${Math.round(interaction.client.ws.ping)}ms` });
    },
};