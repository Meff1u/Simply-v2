const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Command list and information.')
        .setDescriptionLocalizations({
            pl: 'Lista komend i informacje.',
        })
        .addStringOption(option => option
            .setName('command')
            .setNameLocalizations({
                pl: 'komenda',
            })
            .setDescription('Enter command name for more info.')
            .setDescriptionLocalizations({
                pl: 'Wprowadź nazwę komendy po więcej informacji.',
            })
            .setRequired(false)),
    ephemeral: true,
    category: 'info',
    permPower: 0,
    logable: false,
    async execute(interaction, lang, guildcfg) {
        const command = interaction.options.getString('command');
        const { commands } = interaction.client;
        if (!command) {
            let infocmds = '';
            let moderationcmds = '';
            commands.forEach(cmd => {
                if (cmd.category === 'info') {
                    infocmds += `, </${cmd.data.name}:${lang.commands[cmd.data.name].id}>`;
                }
                else if (cmd.category === 'moderation') {
                    moderationcmds += `, </${cmd.data.name}:${lang.commands[cmd.data.name].id}>`;
                }
            });
            const embed = new EmbedBuilder()
            .setTitle(lang.commands.help.helpTitle)
            .addFields(
                { name: lang.commands.help.helpFieldInfo, value: infocmds.slice(2) },
                { name: lang.commands.help.helpFieldMod, value: moderationcmds.slice(2) },
            )
            .setColor('#69BB57')
            .setFooter({ iconURL: interaction.client.user.displayAvatarURL(), text: lang.commands.help.helpFooter });

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setURL('https://github.com/Mefuuu/Simply-v2/issues')
                .setLabel(lang.commands.help.reportButton)
                .setStyle(ButtonStyle.Link)
                .setEmoji('🐛'),
                new ButtonBuilder()
                .setLabel(lang.commands.help.supportButton)
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/fMUmHvQV43'),
            );

            await interaction.followUp({ embeds: [embed], components: [row] });
        }
        else {
            const findedcmd = commands.get(command);
            if (!findedcmd) {
                return await interaction.followUp({ content: lang.commands.help.commandNotExists });
            }
            let serverperm = '';
            if (guildcfg.commands && guildcfg.commands[findedcmd.data.name]) {
                serverperm += `\n${lang.commands.help.infoPermissionBarServer} \`${guildcfg.commands[findedcmd.data.name].permPower}\``;
            }
            let usage = '';
            lang.commands[findedcmd.data.name].infoUsage.forEach((u) => {
                usage += `</${findedcmd.data.name}:${lang.commands[findedcmd.data.name].id}> ${u}\n`;
            });
            const embed = new EmbedBuilder()
            .setTitle(`${lang.commands.help.infoCommandTitle} ${findedcmd.data.name}`)
            .setColor('#69BB57')
            .addFields(
                { name: `${lang.commands.help.infoDetailedDescBar}`, value: lang.commands[findedcmd.data.name].infoDetailedDesc },
                { name: '\u200B', value: '\u200B' },
                { name: lang.commands.help.infoUsageBar, value: usage, inline: true },
                { name: lang.commands.help.infoPermissionBar, value: `${lang.commands.help.infoPermissionBarDefault} \`${findedcmd.permPower}\`${serverperm}`, inline: true },
            )
            .setFooter({ text: lang.commands.help.infoFooter });
            await interaction.followUp({ embeds: [embed] });
        }
    },
};