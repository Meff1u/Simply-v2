const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const guildcfgs = require('../../schemas/guildcfg');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Creating or management for verification system.')
        .setDescriptionLocalizations({
            pl: 'Tworzenie lub zarządzanie systemem weryfikacji.',
        })
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Create veerification system.')
            .setDescriptionLocalizations({
                pl: 'Utwórz system weryfikacji.',
            })
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Select the channel for verification system.')
                .setDescriptionLocalizations({
                    pl: 'Wybierz kanał do systemu weryfikacji.',
                })
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Select a role to be added after succesful verification.')
                .setDescriptionLocalizations({
                    pl: 'Wybierz rolę, która ma być nadawana po udanej weryfikacji.',
                })
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('edit')
            .setDescription('Edit verification system.')
            .setDescriptionLocalizations({
                pl: 'Edytuj system weryfikacji.',
            }))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Completely removes the verification system on the server.')
            .setDescriptionLocalizations({
                pl: 'Całkowicie usuwa system weryfikacji na serwerze.',
            })),
    ephemeral: true,
    category: 'moderation',
    permPower: 10,
    logable: false,
    async execute(interaction, lang, guildcfg) {
        if (interaction.options.getSubcommand() === 'create') {
            if (guildcfg.verify?.enabled) return await interaction.followUp({ content: lang.commands.verify.alreadyExists });

            const vchannel = interaction.options.getChannel('channel');
            if (!vchannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) return await interaction.followUp({ content: lang.commands.verify.noPerms });
            
            const vrole = interaction.options.getRole('role');
            const bhrole = interaction.guild.members.me.roles.highest;
            if (vrole.position > bhrole.position) return await interaction.followUp({ content: lang.commands.verify.noHigher });
            if (vrole.tags) return await interaction.followUp({ content: lang.commands.verify.noBotRole });

            const embed = new EmbedBuilder()
            .setTitle(`${lang.commands.verify.title} ${interaction.guild.name}`)
            .setDescription(lang.commands.verify.desc)
            .setColor('#69BB57')
            .setThumbnail(interaction.guild.iconURL());
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel(lang.commands.verify.button)
                    .setStyle(ButtonStyle.Success),
                );
            vchannel.send({ embeds: [embed], components: [row] }).then(async m => {
                guildcfg = await guildcfgs.updateOne({ gid: interaction.guild.id }, { verify: { enabled: true, channelId: vchannel.id, messageId: m.id, roles: [ vrole.id ] } });
            });
            await interaction.followUp({ content: `${lang.commands.verify.created} (${vchannel})` });
        }
    },
};