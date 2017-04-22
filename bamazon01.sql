create database bamazonDB;
use bamazonDB;
create table products ( 
item_id int (11) auto_increment not null primary key,
product_name varchar (250),
department_name varchar (250),
price dec(10,2),
stock_quantity int (11)
);

-- use bamazonDB;
-- select * from products;

use bamazonDB;
insert into products (product_name, department_name, price, stock_quantity)
values ("universal charger", "electronics and tech", 10, 10),
("canvas tote bag",	"handbags",	39.99, 5),
("umberlla",	"household",	19.99,	7),
("Alex", "alex", 179.99, 15),
("hand mixer",	"appliances", 29.99, 5),
("4k tv",	"appliances", 3299.99, 4),
("6 oz scented candle",	"household", 12.99,25),
("headphones",	"electronics and tech", 49.99, 15),
("computer bag", "electronics and tech", 69.99, 5),
("cutting board", "household", 29.99, 7);

use bamazonDB;
update products
set stock_quantity = 3 where item_id = 4;
select * from products;

use bamazonDB;
create table departments (
department_id int (11) auto_increment not null primary key
department_name varchar (250) ,
over_head_costs dec (10,2),
total_sales dec (10,2)
);

alter table products 
add product_sales dec (10,2)


desc bamazonDB.products;


