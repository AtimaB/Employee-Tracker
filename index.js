let mysql = require('mysql');
let inquirer = require('inquirer');
// const { start } = require('repl');

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

// function which prompts the user for what action they should take
function startTracking() {
  console.log(`............................`);
  console.log('')
  console.log(`WELCOME TO EMPLOYEE TRACKER.`);
  console.log('')
  console.log(`............................`);
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employee',
        'View All Department',
        'View All Manager',
        'Add Employee',
        'Add Department',
        'Remove Emlpoyee',
        'Remove Department',
        'Exit!',
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case 'View All Employee':
          viewEmployee();
          break;

        case 'View All Department':
          viewByDepartment();
          break;

        case 'View All Manager':
          viewByManager();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Remove Emlpoyee':
          removeEmployee();
          break;

        case 'Remove Department':
          removeDepartment();
          break;

        case 'Exit!':
          connection.end();
          console.log(`..............................`);
          console.log('')
          console.log(`--- END TRACKING! GOOD BYE..---`);
          console.log('')
          console.log(`..............................`);
          break;
      }
    });
}
// function to handle viewing all employee 
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
// function to handle viewing all departments
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
// function to handle viewing all managers
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
// function to handle adding new employee to sql database
function addEmployee() {
  connection.query("SELECT * FROM roles",
    function (err, res) {
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
              let roleChoices = [];
              for (let i = 0; i < res.length; i++) {
                roleChoices.push(res[i].title);
              }
              return roleChoices;
            },

          }
        ]).then(function (data) {
          let roleID;
          for (var i = 0; i < res.length; i++) {
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
              console.log("");
              console.log("----- Your Employee has been added! ----");
              console.log("");
              startTracking();
            }
          )
        })
    })
}

//function to handle adding new department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDept",
        type: "input",
        message: "What is the new department you would like to add?"
      }
    ]).then(function (data) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: data.newDept
        }
      );
      var query = "SELECT * FROM department";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("");
        console.table("----- Your new Department has been added! ----", res);
        console.log("");
        startTracking();
      })
    })
}


// // function to handle removing employee from sql database
function removeEmployee() {
  connection.query(`SELECT  CONCAT(employee.first_name,' ',employee.last_name) as Fullname ,employee.id FROM employee`,
    function (err, res) {
      if (err) throw err;

      inquirer.prompt([
        {
          name: "remove",
          type: "list",
          message: "Which Employee would you like to remove?",
          choices: function () {
            let employeeChoices = [];
            for (var i = 0; i < res.length; i++) {
              employeeChoices.push("ID:" + res[i].id + "  " + res[i].Fullname);
            }
            return employeeChoices;
          },
        }
      ]).then(function () {
        let chosenEmployee;
        for (var i = 0; i < res.length; i++) {
          chosenEmployee = res[i].id;
        }
        connection.query("DELETE FROM employee WHERE id = ?", chosenEmployee,
          function (err, res) {
            if (err) throw err;
            console.log("");
            console.log("----- Your Employee has been removed! ----");
            console.log("");
            startTracking();
          })
      }
      )
    })
}

// function to handle remove department
function removeDepartment() {
  connection.query(`SELECT * FROM department`,
    function (err, res) {
      if (err) throw err;

      inquirer.prompt([
        {
          name: "remove",
          type: "list",
          message: "Which Department would you like to remove?",
          choices: function () {
            let departmentChoices = [];
            for (var i = 0; i < res.length; i++) {
              departmentChoices.push("ID:" + res[i].id + "  " + res[i].department_name);
            }
            return departmentChoices;
          },
        }
      ]).then(function () {
        let chosenDepartment;
        for (var i = 0; i < res.length; i++) {
          chosenDepartment = res[i].id;
        }
        connection.query("DELETE FROM department WHERE id = ?", chosenDepartment,
          function (err, res) {
            if (err) throw err;
            console.log("");
            console.log("----- Your Department has been removed! ----");
            console.log("");
            startTracking();
          })
      }
      )
    })
}





// function to handle adding new role
// function addRole() {
//   let department = {};
//   connection.query("SELECT * FROM department",
//     function (err, res) {
//       if (err) throw err;

//       inquirer
//         .prompt([
//           {
//             name: "role_id",
//             type: "input",
//             message: "Please enter the new role."
//           },
//           {
//             name: "salary",
//             type: "input",
//             message: "What is the salary for this role?"
//           },
//           {
//             name: "department_id",
//             type: "list",
//             message: "please select the Department.",
//             choices: function () {
//               let departmentChoices = [];
//               for (let i = 0; i < res.length; i++) {
//                 departmentChoices.push(res[i].id + " " + res[i].department_name);
//               }
//               return departmentChoices;
//             },
//           }
//         ]).then(function (data) {
//           let deptID;
//           for (var i = 0; i < res.length; i++) {
//             if (res[i].id === data.departmentID) {
//               deptID = res[i];
//             }
//           }
//           connection.query(
//             "INSERT INTO roles SET ?",
//             {
//               title: data.role_id,
//               salary: data.salary,
//               department_id: deptID
//             },
//             function (err, res) {
//               if (err) throw err;
//               console.log("");
//               console.table("----- Your new Role has been added! ----", res);
//               console.log("");
//               startTracking();
//             }
//           )
//         })
//     })
// }




// function to handle updating employee's role from sql database
// function updateEmployeeRole() {
//   connection.query(`SELECT * , CONCAT(first_name, " ", last_name) AS "Fullname", 
//   roles.id , roles.title AS Role FROM employee 
//   LEFT JOIN roles ON employee.role_id = roles.id;`,
//     function (err, res) {
//       if (err) throw err;
//       inquirer.prompt([
//         {
//           name: "updateRole",
//           type: "list",
//           message: "Whose Role do you wish to update?",
//           choices: function () {
//             let employeeRoleChoices = [];
//             for (var i = 0; i < res.length; i++) {
//               employeeRoleChoices.push(res[i].Fullname);
//             }
//             return employeeRoleChoices;
//           }
//         },
//         {
//           name: "newRole",
//           type: "list",
//           message: "What is this employee's new role? ",
//           choices: function () {
//             let newRoleChoices = [];
//             for (let i = 0; i < res.length; i++) {
//               newRoleChoices.push(res[i].Role);
//             }
//             return newRoleChoices;
//           },
//         }
//       ]).then(function (data) {
//         console.log(data)
//         let chosenNewRole;
//         for (var i = 0; i < res.length; i++) {
//           chosenNewRole = + res[i].id;
//         }
//         connection.query(`UPDATE roles SET ? WHERE id = ?`,
//           [{
//             employeeRoleChoices: data.employee.id
//           },
//           {
//             newRoleChoices: data.roles.id
//           }],
//           function (err, res) {
//             if (err) throw err;
//             console.log("");
//             console.log("----- Your Employee's new role has been updated! ----");
//             console.log("");
//             startTracking();
//           }
//         )
//       })
//     }
//   )
// }

