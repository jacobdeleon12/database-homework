var mysql = require("mysql");
var inquirer = require("inquirer");

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
    
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push("ID # = " + results[i].id +" | " +
                  results[i].product_name + " Quantity = "+ 
                  results[i].stock_quantity);
                }
                console.log(choiceArray);
                start();
    });
};    

function lowInvertory(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        var lowIn = [];

        for (let i = 0; i < results.length; i++) {
          if (results[i].stock_quantity <= 5) {
            lowIn.push("ID # = " + results[i].id +" | " +
            results[i].product_name + " Quantity = "+ 
            results[i].stock_quantity)
          }
          
        }
        console.log(lowIn);
        start();
    });
};

function addInventory(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
      

        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push("ID # = " + results[i].id +" | " +
                  results[i].product_name + " Quantity = "+ 
                  results[i].stock_quantity);
                }
                return choiceArray;
              },
              message: "What item would you like to update the quantity",
            },
            {
                name: "update",
                type: "input",
                message: "How much would you like to update by?"
            }
        ])
                .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            var newQuantity;
            

            

            for (var i = 0; i < results.length; i++) {
                if ("ID # = " + results[i].id +" | " +
                results[i].product_name + " Quantity = "+ 
                results[i].stock_quantity === answer.choice) {

                chosenItem = results[i];
                newQuantity = results[i].stock_quantity 
                
                }
            }

            newQuantity = parseInt(answer.update)

            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQuantity
                  },
                  {
                    id: chosenItem.id
                  }
                ],
                function(error) {
                  if (error) throw err;

             

                  console.log("Update was successfully! new Quantity = " + newQuantity);
                  
                  
                  start();
                }
              );
        });
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
              console.log("Product posted!\n");
              console.log("Item = "+ response.item);
              console.log("Department = " + response.department);
              console.log("Price = "+ response.price);
              console.log("Quantity = "+ response.quantity+"\n");
              
              start();
            }
          ));
        });
        
};