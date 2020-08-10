let mysql = require('mysql');
let inquirer = require('inquirer');
const { start } = require('repl');

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: '',
  password: '',
  database: 'employee_trackerDB',
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  console.log(`Welcome to Employee Tracker.`);
  console.log(`............................`);
  inquirer.prompt({});
}
