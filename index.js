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
        'View All Employee By Manager',
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

        case 'View All Employee By Manager':
          viewByManager();
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
  let query = `
  SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department_name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
  FROM employee 
  LEFT JOIN roles ON employee.role_id = roles.id
  LEFT JOIN department ON department.id = roles.department_id
  LEFT JOIN employee as manager ON employee.manager_id = manager.id;`;
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

function viewByManager() {
  let query = `
  SELECT DISTINCT concat(manager.first_name, " ", manager.last_name) AS full_name
  FROM employee
  LEFT JOIN employee AS manager ON manager.id = employee.manager_id;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + ' roles found.');
    console.log("All roles")
    console.table(res);
    startTracking();
  });
}

function addEmployee() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the Employee's first name? ",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the Employee's last name?"
        },
        {
          name: "role",
          type: "list",
          message: "What is this employee's role? ",
          choices: function () {
            var roleChoices = [];
            for (let i = 0; i < res.length; i++) {
              roleChoices.push(res[i].title);
            }
            return roleChoices;
          },
          
        }
      ]).then(function (data) {
        let roleID;
       
        for (let i = 0; i < res.length; i++) {
          if (res[i].title == data.role) {
            roleID = res[i].id;
            console.log(roleID)
          }
        }
        connection.query("INSERT INTO employee SET ?",
          {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: roleID,
            manager_id: roleID
          },
          function (err) {
            if (err) throw err;
            console.log("Your Employee has been added!");
            startTracking();
          }
        )
      })
  })
}