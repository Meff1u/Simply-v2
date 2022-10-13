const chalk = require('chalk');
const { connection } = require('mongoose');

connection.on('disconnected', async () => {
    console.log(chalk.redBright('[Database] Disconeccted.'));
});