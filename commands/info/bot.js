const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const package = require('../../package.json');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Informations about Simply.')
        .setDescriptionLocalizations({
            pl: 'Informacje o Simply.',
        }),
    ephemeral: true,
    category: 'info',
    permPower: 0,
    logable: false,
    async execute(interaction, lang) {
        const { commands } = interaction.client;
        const embed = new EmbedBuilder()
        .setTitle(lang.commands.bot.title)
        .setDescription(`• ${lang.commands.bot.descID} **${interaction.client.user.id}**\n• ${lang.commands.bot.descAuthor} **${package.author}**\n• ${lang.commands.bot.descCreated} **<t:${Math.round(interaction.client.user.createdTimestamp / 1000)}:R>**`)
        .setColor('#69BB57')
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setFields(
            { name: lang.commands.bot.fieldStatsName, value: `> ${lang.commands.bot.fieldStatsDescGuilds} **${interaction.client.guilds.cache.size}**\n> ${lang.commands.bot.fieldStatsDescMembers} **${interaction.client.users.cache.size}**\n> ${lang.commands.bot.fieldStatsDescCommands} **${commands.size}**` },
            { name: lang.commands.bot.fieldHostName, value: `> ${lang.commands.bot.fieldHostDescOS} **${process.platform}**\n> ${lang.commands.bot.fieldHostDescRAM} **${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)}/${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB** (${Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)}%)\n> ${lang.commands.bot.fieldHostDescCPU} **${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB** (${os.cpus().length} cores)\n> ${lang.commands.bot.fieldHostDescRestart} **<t:${Math.round(interaction.client.readyTimestamp / 1000)}:R>**\n> ${lang.commands.bot.fieldHostDescPing} **${Math.round(interaction.client.ws.ping)}ms**` },
            { name: lang.commands.bot.fieldVersionsName, value: `> Simply: **${lang.changelog[0].ver}**\n> Node.js: **${process.versions.node}**\n> Discord.js: **${package.dependencies['discord.js'].replace('^', '')}**\n> MongoDB: **${package.dependencies['mongoose'].replace('^', '')}**` },
        );
        await interaction.followUp({ embeds: [embed] });
    },
};