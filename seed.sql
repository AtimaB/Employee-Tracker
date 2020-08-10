DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department
(
  id INTEGER
  AUTO_INCREMENT NOT NULL,
  department_name VARCHAR
  (30) NOT NULL,
  PRIMARY KEY
  (id)
);

  CREATE TABLE roles
  (
    id INTEGER
    AUTO_INCREMENT NOT NULL,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY
    (id),
    FOREIGN KEY
    (department_id) REFERENCES department
    (id) ON
    DELETE CASCADE
  );


    CREATE TABLE employee
    (
      id INTEGER
      AUTO_INCREMENT,
  first_name VARCHAR
      (30) NOT NULL,
  last_name VARCHAR
      (30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER NULL,
  PRIMARY KEY
      (id),
  FOREIGN KEY
      (role_id) 
  REFERENCES roles
      (id) ON
      DELETE CASCADE,
  FOREIGN KEY (manager_id)
      REFERENCES employee
      (id) ON
      DELETE
      SET NULL
      );

      INSERT INTO department
        (department_name)
      VALUES
        ('Sale'),
        ('Engineering'),
        ('Finance'),
        ('Legal');


      INSERT INTO roles
        (title, salary, department_id)
      VALUES
        ('Sale Lead', '60000', '1' ),
        ('Software Enigineer', '80000', '2'),
        ('Accountant', '40000', '3'),
        ('Legal Team Lead', '60000', '4');

      INSERT INTO employee
        ( first_name,last_name,role_id,manager_id )
      VALUES
        ('Kayleigh', 'Gonzales', '1', null),
        ('Harper', 'Roberson', '2', '2'),
        ('Athena', 'Clay', '3', '3'),
        ('Karishma', 'Payne', '4', null);

      SELECT *
      FROM employee;
      SELECT *
      FROM roles;
      SELECT *
      FROM department;
      