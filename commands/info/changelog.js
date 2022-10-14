const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changelog')
        .setDescription('Information about changes.')
        .setDescriptionLocalizations({
            pl: 'Informacje o zmianach.',
        })
        .addStringOption(option => option
            .setName('version')
            .setNameLocalizations({
                pl: 'wersja',
            })
            .setDescription('Enter a specific version to get more information.')
            .setDescriptionLocalizations({
                pl: 'Wprowadź konkretną wersję, aby otrzymać więcej informacji.',
            })
            .setRequired(false)),
    ephemeral: false,
    category: 'info',
    permPower: 0,
    logable: true,
    async execute(interaction, lang) {
        const ver = interaction.options.getString('version');
        if (!ver) {
            let numshow = lang.changelog.length;
            if (numshow > 10) numshow = 10;
            let desc = '';
            for (let i = 0; i < 10; i++) {
                if (!lang.changelog[i]) break;
                desc += `• \`${lang.changelog[i].ver}\` - <t:${lang.changelog[i].date}:R>\n`;
            }
            const embed = new EmbedBuilder()
            .setTitle(`${lang.commands.changelog.title} (${numshow}/${lang.changelog.length})`)
            .setDescription(desc)
            .setColor('#69BB57')
            .setFooter({ text: lang.commands.changelog.footer })
            .setThumbnail(interaction.client.user.displayAvatarURL());
            await interaction.followUp({ embeds: [embed] });
        }
        else {
            for (let i = 0; i < lang.changelog.length; i++) {
                if (ver === lang.changelog[i].ver) {
                    let changes = '';
                    for (let j = 0; j < lang.changelog[i].text.length; j++) {
                        changes += `> • ${lang.changelog[i].text[j]}\n`;
                    }
                    const embed = new EmbedBuilder()
                    .setTitle(`${lang.commands.changelog.infoTitle} ${lang.changelog[i].ver}:`)
                    .setColor('#69BB57')
                    .setDescription(changes)
                    .setTimestamp(lang.changelog[i].date * 1000);
                    if (lang.changelog[i + 1]) {
                        embed.addFields({
                            name: lang.commands.changelog.infoPreviousBar,
                            value: `• \`${lang.changelog[i + 1].ver}\` - <t:${lang.changelog[i + 1].date}:R>`,
                            inline: true,
                        });
                    }
                    if (lang.changelog[i - 1]) {
                        embed.addFields({
                            name: lang.commands.changelog.infoNextBar,
                            value: `• \`${lang.changelog[i - 1].ver}\` - <t:${lang.changelog[i - 1].date}:R>`,
                            inline: true,
                        });
                    }
                    await interaction.followUp({ embeds: [embed] });
                    break;
                }
                else if (i === lang.changelog.length - 1) {
                    await interaction.followUp({ content: lang.commands.changelog.versionNotExists });
                }
            }
        }
    },
};