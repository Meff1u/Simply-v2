const { REST, Routes } = require('discord.js');

const fs = require('fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Commands', 'Type', 'Status').setBorder('|', '=', '0', '0');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

module.exports = (client) => {
    const commands = [];

    fs.readdirSync('./commands/').forEach(async dir => {
        const files = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const command = require(`../commands/${dir}/${file}`);
            commands.push(command.data.toJSON());

            if (command.data.name) {
                client.commands.set(command.data.name, command);
                table.addRow(file.split('.js')[0], dir, '✅');
            }
            else {
                console.log(command);
                table.addRow(file.split('.js')[0], dir, '⛔');
            }
        }
    });
    console.log(chalk.red(table.toString()));

    (async () => {
        try {
            const data = await rest.put(
                Routes.applicationCommands(process.env.ID),
                { body: commands },
            );
            console.log(chalk.yellow(`${data.length}/${commands.length} commands has been registered!`));
        }
        catch (error) {
            console.log(error);
        }
    })();
};