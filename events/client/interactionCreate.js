const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = require('../..');
const guildcfgs = require('../../schemas/guildcfg');

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (command.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        }
        else {
            await interaction.deferReply();
        }

        const guildcfg = await guildcfgs.findOne({ gid: interaction.guild.id });
        const lang = require(`../../data/locale/${guildcfg.lang}.json`);

        const cmdpp = guildcfg.commands[command.data.name]?.permPower ? guildcfg.commands[command.data.name].permPower : command.permPower;
        let memberpp = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) ? 100 : (guildcfg.members && guildcfg.members[interaction.member.id] && guildcfg.members[interaction.member.id].permPower ? guildcfg.members[interaction.member.id].permPower : 0);

        if (guildcfg.roles) {
            for (const role in guildcfg.roles) {
                if (guildcfg.roles[role].permPower) {
                    if (interaction.member.roles.cache.has(role)) {
                        if (guildcfg.roles[role].permPower > memberpp) {
                            memberpp = guildcfg.roles[role].permPower;
                        }
                    }
                }
            }
        }

        if (cmdpp > memberpp) {
            const embed = new EmbedBuilder()
            .setTitle(lang.error.permPowerTitle)
            .setFields(
                { name: lang.error.permPowerRequired, value: `\`${cmdpp}\``, inline: true },
                { name: lang.error.permPowerYour, value: `\`${memberpp}\``, inline: true },
            )
            .setColor('#ff0000');
            return await interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        try {
            await command.execute(interaction, lang, guildcfg);
        }
        catch (error) {
            console.error(error);
            let id = '';
            for (let i = 0; i < 5; i++) {
                id += `${Math.floor(Math.random() * (9 - 1 + 1) + 1)}`;
            }
            interaction.client.channels.cache.get('968187000450609252').send(`Error [${id}]\n\`\`\`${error.stack}\`\`\``);
            await interaction.followUp({ content: `There was an error, contact dev with ID: **${id}**` });
        }
    }
});