const fs = require('fs');
const chalk = require('chalk');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Events', 'Status').setBorder('|', '=', "0", "0");

// eslint-disable-next-line no-unused-vars
module.exports = (client) => {
    fs.readdirSync('./events/').filter((file) => file.endsWith('.js')).forEach((event) => {
        require(`../events/${event}`);
        table.addRow(event.split('.js')[0], '✅');
    });
	console.log(chalk.greenBright(table.toString()));
};