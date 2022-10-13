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

        let gmember = await guildcfgs.findOne({ 'members.id': interaction.member.id });
        if (!gmember) {
            gmember = await guildcfgs.updateOne({ gid: interaction.guild.id }, { members: [ ...guildcfg.members, { id: interaction.member.id, permPower: 0 }] });
        }

        try {
            await command.execute(interaction, lang);
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