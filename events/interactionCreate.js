const client = require('..');

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

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'There was an error, contact dev!' });
        }
    }
});