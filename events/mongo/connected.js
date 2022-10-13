const chalk = require('chalk');
const { connection } = require('mongoose');

connection.on('connected', async () => {
    console.log(chalk.green('[Database] Successfully connected!'));
});