CREATE DATABASE risk_management;
USE risk_management;

CREATE TABLE employee (employee_id INT NOT NULL,
employee_name VARCHAR(45) NOT NULL,
password VARCHAR(12),
PRIMARY KEY(employee_id));

CREATE TABLE leaves (leave_id INT NOT NULL AUTO_INCREMENT,
start_date DATE NOT NULL,
end_date DATE,
leave_count INT DEFAULT 1,
employee_id INT,
PRIMARY KEY (leave_id),FOREIGN KEY (employee_id) REFERENCES employee(employee_id));

CREATE TABLE team (team_id INT NOT NULL,
team_name VARCHAR(45),
threshold FLOAT NOT NULL,
CHECK (threshold >0 AND threshold <=1),
PRIMARY KEY (team_id));

CREATE TABLE employee_team (id INT AUTO_INCREMENT,
e_id INT,
t_id INT,
FOREIGN KEY (e_id) REFERENCES employee(employee_id),
FOREIGN KEY (t_id) REFERENCES team(team_id),
PRIMARY KEY (id));