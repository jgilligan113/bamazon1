var mysql = require("mysql");
var inquirer = require("inquirer");

//connect to database
var connection = mysql.createConnection({
    hose: "localhost",
    port: 3306,
    user: "root",
    password: "entropy04",
    database: "bamazonDB"
});

var managerQ = 
    {
        name: "options",
        message: "Please make a selection",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add New Inventory", "Add New Product"]
    }

function managerConsole() {
//alert connection success-error
connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id "+ connection.threadId + "\n");
    console.log("--------------------------------------\n");

    inquirer.prompt(managerQ).then(function(res) {
    //console.log(res);

        switch(res.options) {
            
        case "View Products for Sale":
            viewProducts();
        break;

        case "View Low Inventory":
            viewLow();
        break;

        case "Add New Inventory":
            addInventory();
        break;

        case "Add New Product":
            addNewProd();
        break;
        }
    })
})
}

function viewProducts() {
    connection.query("select * from products;", function(err, res) {
    console.log("\n WELCOME TO BAMAZON INVENTORY MANAGMENT! \n Items in inventory currenlty are: \n" );
    console.log("*************************\n");
    if (err) throw err;
    for (var i = 0; i < res.length; i ++) {
        console.log("Item ID number: " + res[i].item_id + " \n " + res[i].product_name + " | dept: " +  res[i].department_name + " | price:  $" + res[i].price + " \nQuantity in stock: "+ res[i].stock_quantity);
        console.log("------------------------------------");  
        } connection.end();
    }) 
}

function viewLow() {
    connection.query("select * from products WHERE stock_quantity < 5;", function(err, res) {
    console.log("\n WELCOME TO BAMAZON INVENTORY MANAGMENT! \n Items in inventory currenlty are: \n" );
    console.log("*************************\n");
    if (err) throw err;
    for (var i = 0; i < res.length; i ++) {
        console.log("Item ID number: " + res[i].item_id + " \n " + res[i].product_name + " | dept: " +  res[i].department_name + " | price:  $" + res[i].price + " \nQuantity in stock: "+ res[i].stock_quantity);
        console.log("------------------------------------");     
    }connection.end();
    }) 
}

function addInventory() {
    console.log("WELCOME TO BAMAZON INVENTORY MANAGMENT! \nYou've selected to add inventory. \nHere is a list of current inventory for your reference:\n");
    connection.query("select * from products;", function(err, res) {
    //console.log("\n WELCOME TO BAMAZON INVENTORY MANAGMENT! \n Items in inventory currenlty are: \n" );
    console.log("*************************\n");
    if (err) throw err;
    for (var i = 0; i < res.length; i ++) {
        console.log("Item ID number: " + res[i].item_id + " \n " + res[i].product_name + " | dept: " +  res[i].department_name + " | price:  $" + res[i].price + " \nQuantity in stock: "+ res[i].stock_quantity);
        console.log("------------------------------------");
        //console.log(res)}
        var whatToAdd = [{
            name: "item",
            message: "What item number would you like to add in inventory",
            type: "input"
        },
        {
            name: "qty",
            message: "How many items are you receiving?",
            type: "input"
        }];}
            inquirer.prompt(whatToAdd).then(function(reply) {
                //query for qty and add to it to get new qty then set to new qty
                
                var item = reply.item;
                var qty = reply.qty;
                connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id = ?;", item, function(err, res) {
                   if (err) throw err
                   for (var i = 0; i < res.length; i++) {
                       console.log(res[i].stock_quantity);
                       var newQty = parseInt(qty) + parseInt(res[i].stock_quantity);
                       console.log(newQty);
                       var product = res[i].product_name;
                       connection.query("UPDATE products SET stock_quantity =? WHERE item_id = ?;", [newQty, item], function(err, res) {
                           if (err) throw err
                           console.log("inventory for " + product + " has been updated to " + newQty +".");
                       })
                    } connection.end();
                })
                
            })
        })
    }

function addNewProd() {
    console.log("functionality not available yet.");
    var newProduct = 
    //product_name, department_name, price, stock_quantity
    [{
        name: "product_name",
        message: "What is the product name you would like to add?",
        type: "input"
    },
    {
        name: "department_name",
        message: "What department should the product be under?",
        type: "input"
    },

        {
        name: "price",
        message: "What is the price of each?",
        type: "input"
    },
    {
        name: "stock_quantity",
        message: "What is the quantity if any received?",
        type: "input"
    }]
     inquirer.prompt(newProduct).then(function(prod) {
         console.log(prod);
         connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", ([prod.product_name, prod.department_name, prod.price, prod.stock_quantity ]), function (err, data) {
             if (err) throw err
             console.log("your item has been entered.");
             connection.end();
             }) 
         })    
    }
managerConsole();

