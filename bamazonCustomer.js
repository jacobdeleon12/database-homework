// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require('table');

// Global Varables
var newQuantity = 0;
var item = 0;
var userPrice;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "snake12",
  database: "bamazonDB"
});

// varables for table
var data,
  output,
  options;
// first conection 
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
  start();
});


//start function
function start() {
  inquirer
    .prompt({
      name: "buy",
      type: "list",
      message: "Is there a product you would like to buy?",
      choices: ["Buy", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buy === "Buy") {
        display();
      }
      else {
        connection.end();
      }
    });
};


//displaying all the items in the database
function display() {

  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    var data = [["ID", "Product Name", "Price", "Stock Quantity"]];
    for (var i = 0; i < results.length; i++) {
      // adding each item to the arr
      data.push([
      results[i].id,
      results[i].product_name, 
      results[i].price,
      results[i].stock_quantity]);
      //table options
      options = {columns: {1: {width: 20}},};
      output = table(data, options);
    };
    //display table and run the buy function
    console.log(output);
    buy();
  });
}




function buy() {

  inquirer.prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the product you would like?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like?"
    },

  ]).then(function (response) {
    // checking if the responce was a number. if not functions will not work
    if (isNaN(response.item_id || response.quantity)) {
      console.log("\nPlease enter both a number for ID and Quantity\n");
      buy();
    } else {
      item = parseInt(response.item_id);
      var sql = 'SELECT * FROM products WHERE id = ?';
      //calling DB
      connection.query(sql, item, function (err, result) {
        console.log(result);
        
        if (err) throw err;
        // making sure that the amount requested is less then base stock_quantity
        if (item < result[0].stock_quantity) {
          //calculations for price and new quantity
          userPrice = result[0].price;
          newQuantity = result[0].stock_quantity;
          parseInt(newQuantity -= response.quantity);
          userPrice *= parseInt(response.quantity);
          var fianlPrice = userPrice.toFixed(2);
          // logs checking if calculations are correct
          // console.log(newQuantity);
          // console.log(parseInt(item));
          //updating DB
          var sqlUpdate = "UPDATE products SET ? WHERE  ?";
          connection.query(sqlUpdate,
            [
              {
                stock_quantity: newQuantity
              },
              {
                id: item
              }
            ],
            function (error) {
              if (error) throw err;
              data = [
                ["ID", "Product Name", "Amount Due", "Remaining Quantity"],
                [result[0].id, result[0].product_name, fianlPrice, newQuantity],
              ];
              //showing user price and new quantity
              output = table(data);
              console.log(output);

              start();
            });
            }
            else {
              // bid wasn't high enough, so apologize and start over
              console.log("\nQuantity was too low. Try again...\n");
              start();
            }
      });
    }
  });
};
