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
      message: "Is there a product you would like to buy?",
      choices: ["Buy", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buy === "Buy") {
        buy();
      }
       else{
        connection.end();
      }
    });
};

function buy(){
    
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
              message: "What item would you like to buy"
            },
            {
              name: "buy",
              type: "input",
              message: "How much would you like to buy?"
            }
          ])
          .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            var newQuantity;
            var userPrice;

          
    
            for (var i = 0; i < results.length; i++) {
              if ("ID # = " + results[i].id +" | " +
              results[i].product_name + " Quantity = "+ 
              results[i].stock_quantity === answer.choice) {

                chosenItem = results[i];
                newQuantity = results[i].stock_quantity 
                userPrice = results[i].price
              }
            }
            newQuantity -= answer.buy
            userPrice *= parseInt(answer.buy)
    
            // determine if quantity enough
            if (chosenItem.stock_quantity >= parseInt(newQuantity)) {
                
              // bid was high enough, so update db, let the user know, and start over
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

             

                  console.log("order placed successfully! new Quantity = " + newQuantity);
                  console.log("Total Price = " + userPrice);
                  
                  start();
                }
              );
            }
            else {
              // bid wasn't high enough, so apologize and start over
              console.log("quantity was too low. Try again...");
              start();
            }
          });
      });
    }