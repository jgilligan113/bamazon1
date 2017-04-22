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

//alert connection success-error
connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id "+ connection.threadId);
});
//get initial list of items located in database and display options for purchase
connection.query("select * from products;", function(err, res) {
    console.log("\n WELCOME TO BAMAZON! \n Items in stock for purchase are: \n" );
    console.log("*************************\n");
    if (err) throw err;
    for (var i = 0; i < res.length; i ++) {
        console.log("Item ID number: " + res[i].item_id + " \n " + res[i].product_name + " | dept: " +  res[i].department_name + " | price:  $" + res[i].price + " | ");
        console.log("------------------------------------");  
}

//to prevent asking prior to displaying items, inquire of What Item and How many is inside the query function
var whatItemHowMany = [ {
    type: "input",
    message: "\n What item number will you be purchasing today?",
    name: "item"
  },

  // Here we create a basic password-protected text prompt.
  {
    type: "input",
    message: "How many will you be needing?",
    name: "qty"
  }];
//prompt the user
    inquirer.prompt(whatItemHowMany).then(function(res) {
        var item = res.item;
        var qty = res.qty; 
        console.log("\nYou've requested "  + qty + " of item #: " + item );

//check the stock of item requested
        connection.query("select stock_quantity, price from products where item_id=?;", item, function(err, data) {
            for (var i = 0; i < data.length; i ++) {
                console.log("\n---------------------");
                console.log("Quantity in stock: " + data[i].stock_quantity);
                console.log("Quantity requested: " + qty);
                var totalCost = qty * data[i].price;
            //if the quantity requested is greater than the queried stock; there is not enough stock to fill the order.    
            if (qty > data[i].stock_quantity) {
                console.log("We don't have enought to meet the need! :( ");
                connection.end();
            } else {
            //otherwise, we can process the order and provide the total and remove the items from inventory.    
                var newQty = data[i].stock_quantity - qty;
                //console.log("Quantity was: "+ data[i].stock_quantity)
                connection.query("UPDATE products SET stock_quantity =? where item_id =?;", [newQty, item], function(err, data) {
                if (err) throw err;
                //user feedback that order was placed and what the cost to their Bamazon prime acct card totals.
                console.log("\n\nYour order total is: $" + totalCost + ".  \nYour order has been placed and will arrive in 2 business days.\n\nThank you for being a BAMAZON prime member.\n\n");
                connection.end();
                    })
                }
            }
        })
    })
})

