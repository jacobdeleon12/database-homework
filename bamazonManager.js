var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require('table');

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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });
   
function start(){
    inquirer
    .prompt({
      name: "buy",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buy === "View Products for Sale") {
        forSale();
      }
      if (answer.buy === "View Low Inventory") {
        lowInvertory();
      }
      if (answer.buy === "Add to Inventory") {
        addInventory();
      }
      if (answer.buy === "Add New Product") {
        addProduct();
      }
       else{
        connection.end();
      }
    });
};

function forSale(){
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
    
   
  });
};    

function lowInvertory(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log("\n~~~~~~~~~~Product under 5 units~~~~~~~~~~\n");
        
        var data = [["ID", "Product Name", "Stock Quantity"]];

        for (let i = 0; i < results.length; i++) {
          if (results[i].stock_quantity <= 5) {
            data.push([
              results[i].id,
              results[i].product_name, 
              results[i].stock_quantity]);
          }
          
          options = {columns: {1: {width: 20}},};
          output = table(data, options);
          
        }
        console.log(output);
       
    });
};

function addInventory(){
  forSale();
  
  inquirer.prompt([
    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the product you would like?"
    },
    {
      type: "input",
      name: "quantity",
      message: "How many would you like to add?"
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
        if (err) throw err;
        // making sure that the amount requested is less then base stock_quantity
        if (item < result[0].stock_quantity) {
          //calculations for price and new quantity
          
          newQuantity = result[0].stock_quantity;
          parseInt(newQuantity += response.quantity);
          
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
                ["ID", "Product Name",  "Remaining Quantity"],
                [result[0].id, result[0].product_name, newQuantity],
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


function addProduct() {
    inquirer.prompt([
        // Here we create a basic text prompt.
        {
          type: "input",
          message: "What is the item name?",
          name: "item"
        },
        {
          type: "input",
          message: "What is the department name?",
          name: "department"
        },
        {
          type: "input",
          message: "How much do you want to sell it for?",
          name: "price"
        },
        {
          type: "input",
          message: "How many are you selling?",
          name: "quantity"
        }
      ])
        .then(function (response) {
          
          
          connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: response.item,
              department_name: response.department,
              price: response.price,
              stock_quantity: response.quantity
            },
            connection.query("SELECT * FROM products", function (err, res) {
              if (err) throw err;
              var data = [["ID", "Product Name", "department", " Quantity"],
              [response.item,response.department,response.price, response.quantity]];

              options = {columns: {1: {width: 20}},};
              output = table(data, options);

              console.log("Product posted!\n");
              console.log(output);

              
              start();
            }
        ));
    });
        
};