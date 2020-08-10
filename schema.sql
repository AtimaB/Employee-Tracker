DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department
(
  id INTEGER NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles
(
  id INTEGER NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
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
  (role_id) REFERENCES roles
  (id) ON
  DELETE CASCADE,
  FOREIGN KEY (manager_id)
  REFERENCES employee
  (id) ON
  DELETE
  SET NULL
  );