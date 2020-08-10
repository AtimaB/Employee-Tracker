let mysql = require('mysql');
let inquirer = require('inquirer');
const { start } = require('repl');

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dogdog6808',
  database: 'employee_trackerDB',
});

connection.connect(function (err) {
  if (err) throw err;
  startTracker();
});

function startTracker() {
  console.log(`............................`);
  console.log(`Welcome to Employee Tracker.`);
  console.log(`............................`);
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add Employee.',
      'Remove Emlpoyee.',
      'Update Employee Role.',
      'Update Employee Manager.',
      'Exit!',
    ],
  });
}
