const chalk = require('chalk');
const { connection } = require('mongoose');

connection.on('connecting', async () => {
    console.log(chalk.cyan('[Database] Connecting...'));
});