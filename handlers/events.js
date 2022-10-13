const fs = require('fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Events', 'Type', 'Status').setBorder('|', '=', "0", "0");

// eslint-disable-next-line no-unused-vars
module.exports = (client) => {
    fs.readdirSync('./events/').forEach(async dir => {
        const files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
        for (const file of files) {
            require(`../events/${dir}/${file}`);
            table.addRow(file.split('.js')[0], dir, '✅');
        }
    });
	console.log(chalk.greenBright(table.toString()));
};