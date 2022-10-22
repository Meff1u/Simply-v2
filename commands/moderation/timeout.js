const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const guildcfgs = require('../../schemas/guildcfg');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Prevent the member from typing and talking.')
        .setDescriptionLocalizations({
            pl: 'Uniemożliwia użytkownikowi pisanie i rozmawianie.',
        })
        .addUserOption(option => option
            .setName('member')
            .setDescription('Select member you want to timeout.')
            .setDescriptionLocalizations({
                pl: 'Wybierz użytkownika, którego chcesz wyciszyć.',
            })
            .setRequired(true))
        .addStringOption(option => option
            .setName('time')
            .setDescription('Enter timeout duration (e.g. 7d 5h 2m).')
            .setDescriptionLocalizations({
                pl: 'Wpisz czas trwania wyciszenia (np. 7d 5h 2m).',
            })
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Enter reason for timeout.')
            .setDescriptionLocalizations({
                pl: 'Wpisz powód wyciszenia.',
            })
            .setRequired(false)),
    ephemeral: false,
    category: 'moderation',
    permPower: 10,
    logable: true,
    async execute(interaction, lang, guildcfg) {
        const tomute = interaction.options.getUser('member');

        if (await getPermissionPower(interaction, guildcfg, tomute.id) >= await getPermissionPower(interaction, guildcfg, interaction.member.id)) {
            const embed = new EmbedBuilder()
            .setDescription(lang.commands.timeout.permPower)
            .setColor('#ff0000')
            .setFields(
                { name: `${tomute.tag} ${lang.commands.timeout.mentionedPermPower}`, value: `\`${await getPermissionPower(interaction, guildcfg, tomute.id)}\``, inline: true },
                { name: lang.commands.timeout.yourPermPower, value: `\`${await getPermissionPower(interaction, guildcfg, interaction.member.id)}\``, inline: true },
            );
            return await interaction.followUp({ embeds: [embed] });
        }

        const time = ms(interaction.options.getString('time'));
        if (!time) return await interaction.followUp({ content: lang.commands.timeout.wrongTime });
        const reason = interaction.options.getString('reason') || lang.error.noReason;
        const tomutem = await interaction.guild.members.fetch(tomute.id);
        try {
            const response = await tomutem.timeout(time, reason);

            if (!response) {
                console.log(response);
                return interaction.followUp({ content: lang.commands.timeout.error });
            }
        }
        catch (error) {
            console.log(error);
            if (error.stack.includes('Invalid communication disabled timestamp')) return await interaction.followUp({ content: lang.commands.timeout.invalidTime + `\n\`\`\`${error}\`\`\`` });
            return await interaction.followUp({ content: lang.commands.timeout.error });
        }

        await interaction.followUp({ content: `${tomute} ${lang.commands.timeout.timedOut} ${ms(time, { long: true })}` });
        guildcfg = await guildcfgs.updateOne({ gid: interaction.guild.id }, { $push: { [`members.${tomute.id}.punishments`]: { type: 'Timeout', reason: reason, time: Date.now(), by: `${interaction.member.id}` } } });
    },
};

async function getPermissionPower(interaction, guildcfg, uid) {
    const member = await interaction.guild.members.fetch(uid);

    let pp = member.permissions.has(PermissionsBitField.Flags.Administrator) ? 100 : (guildcfg.members[member.id]?.permPower ? guildcfg.members[interaction.member.id].permPower : 0);

    if (guildcfg.roles) {
        for (const role in guildcfg.roles) {
            if (guildcfg.roles[role].permPower) {
                if (member.roles.cache.has(role)) {
                    if (guildcfg.roles[role].permPower > pp) {
                        pp = guildcfg.roles[role].permPower;
                    }
                }
            }
        }
    }
    return pp;
}