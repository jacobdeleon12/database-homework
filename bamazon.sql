DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ASUS Laptop", "Electronics", 1000.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Carmex", "Beauty", 3.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HP Monitor", "Electronics", 350.49, 150);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("D20 Dice", "Board Games", 1.99, 1830);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nail Clipers", "Beauty", 2.50, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gerber Multi Tool", "Tools", 19.99, 27);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Raspberry PI", "Electronics", 50.00, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wallet", "Personal", 26.49, 32);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iphone", "Electronics", 1000.00, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hydro Flask", "Personal", 45.00, 5);

SELECT * FROM products