const chalk = require('chalk');
const { connection } = require('mongoose');

connection.on('err', async (err) => {
    console.log(chalk.red(`[Database] Error:\n${err}`));
});