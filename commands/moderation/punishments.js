const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punishments')
        .setDescription('Check the member punishments.')
        .setDescriptionLocalizations({
            pl: 'Sprawdź kary użytkownika.',
        })
        .addUserOption(option => option
            .setName('member')
            .setDescription('Choose the member whose punishments you want to check.')
            .setDescriptionLocalizations({
                pl: 'Wybierz użytkownika, którego kary chcesz sprawdzić.',
            })
            .setRequired(true))
        .addStringOption(option => option
            .setName('type')
            .setDescription('Select the type of punishment.')
            .setDescriptionLocalizations({
                pl: 'Wybierz typ kary.',
            })
            .setRequired(true)
            .addChoices(
                { name: 'All', value: 'all' },
                { name: 'Timeout', value: 'Timeout' },
            )),
    ephemeral: false,
    category: 'moderation',
    permPower: 10,
    logable: false,
    async execute(interaction, lang, guildcfg) {
        const user = interaction.options.getUser('member');

        if (!guildcfg.members[user.id]?.punishments) return await interaction.followUp({ content: lang.commands.punishments.noPunishments });

        const type = interaction.options.getString('type');

        if (type === 'all') {
            let numshow = guildcfg.members[user.id].punishments.length;
            if (numshow > 10) numshow = 10;
            let desc = '';
            for (let i = 0; i < numshow; i++) {
                desc += `\`[${i}]\` **${guildcfg.members[user.id].punishments[i].type}** - \`${guildcfg.members[user.id].punishments[i].reason}\` (<t:${Math.round(guildcfg.members[user.id].punishments[i].time / 1000)}:R>)\n`;
            }
            const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setTitle(`${lang.commands.punishments.all} (${numshow}/${guildcfg.members[user.id].punishments.length})`)
            .setDescription(desc)
            .setFooter({ text: lang.commands.punishments.footer })
            .setColor('#69BB57');
            await interaction.followUp({ embeds: [embed] });
        }
        else if (type === 'Timeout') {
            let numshow = 0, numall = 0;
            let desc = '';
            for (let i = 0; i < guildcfg.members[user.id].punishments.length; i++) {
                if (guildcfg.members[user.id].punishments[i].type === type) {
                    numall++;
                    if (numall <= 10) {
                        desc += `\`[${i}]\` **${guildcfg.members[user.id].punishments[i].type}** - \`${guildcfg.members[user.id].punishments[i].reason}\` (<t:${Math.round(guildcfg.members[user.id].punishments[i].time / 1000)}:R>)\n`;
                        numshow++;
                    }
                }
            }
            const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setTitle(`${type} ${lang.commands.punishments.type} (${numshow}/${numall})`)
            .setDescription(desc)
            .setFooter({ text: lang.commands.punishments.footer })
            .setColor('#69BB57');
            await interaction.followUp({ embeds: [embed] });
        }
    },
};