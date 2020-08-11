USE employee_trackerDB;

INSERT INTO
  department (department_name)
VALUES
  ('Sale'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO
  roles (title, salary, department_id)
VALUES
  ('Sale Lead', '60000', '1'),
  ('Software Enigineer', '80000', '2'),
  ('Accountant', '40000', '3'),
  ('Legal Team Lead', '60000', '4');

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Kayleigh', 'Gonzales', '1', null),
  ('Harper', 'Roberson', '2', '2'),
  ('Athena', 'Clay', '3', '3'),
  ('Karishma', 'Payne', '4', null);

SELECT * FROM employee;

SELECT * FROM roles;

SELECT * FROM department;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, roles.salary, department_name AS department_name, concat(manager.first_name, " ", manager.last_name) AS manager_full_name
  FROM employee 
  LEFT JOIN roles ON employee.role_id = roles.id
  LEFT JOIN department ON department.id = roles.department_id
  LEFT JOIN employee as manager ON employee.manager_id = manager.id;