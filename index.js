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
  startTracking();
});

function startTracking() {
  console.log(`............................`);
  console.log(`Welcome to Employee Tracker.`);
  console.log(`............................`);
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employee',
        'View All Employee By Department',
        'View All Employee By Role',
        'Add Employee',
        'Remove Emlpoyee',
        'Update Employee Role',
        'Update Employee Manager',
        'Exit!',
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case 'View All Employee':
          viewEmployee();
          break;

        case 'View All Employee By Department':
          viewByDepartment();
          break;

        case 'View All Employee By Role':
          viewByRole();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Remove Emlpoyee':
          removeEmployee();
          break;

        case 'Update Employee Role':
          updateEmployeeRole();
          break;

        case 'Update Employee Manager':
          updateEmployeeManager();
          break;

        case 'Exit!':
          connection.end();
          break;
      }
    });
}

function viewEmployee() {
  let query = 'SELECT * FROM employee_trackerDB.employee';
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + ' employee found.');
    console.log("All employee")
    console.table(res);
    startTracking();
  });
}

function viewByDepartment() {
  let query = 'SELECT * FROM employee_trackerDB.department';
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + ' department found.');
    console.log("All department")
    console.table(res);
    startTracking();
  });
}

function viewByRole() {
  let query = 'SELECT * FROM employee_trackerDB.roles';
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + ' roles found.');
    console.log("All roles")
    console.table(res);
    startTracking();
  });
}

function addEmployee() {
  inquirer.prompt(
    {
      name: 'first_name',
      type: 'input',
      message: 'What is the employees first name?',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'What is the employees last name?',
    },
    {
      name: 'role',
      type: 'list',
      message: 'What is the employees role?',
      choices: [
        'Sale Lead',
        'Saleperson',
        'Lead Engineer',
        'Software Engineer',
        'Account Manager',
        'Accountant',
        'Legal Team Lead',
      ],
    }
  );
}
