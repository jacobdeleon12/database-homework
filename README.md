# Node.js_MySQL

This is Amazon-like storefront with the MySQL skills you learned this unit. The app will take in orders from customers and deplete stock from the store's inventory.

## Getting Started

To run program I needed to have setup A local database with MySQL. Added a bunch of products to database to be manipulated. 

### Prerequisites

To run this program table, inquirer, mysql npm’s are needed to be installed. They should be found in the package.json. All Found on npmjs.com. As well as unique keys for bandsintown/spotify/omdbapi

```
npm i table
```
```
npm i inquirer
```
```
npm i mysql
```

### Installing


```
npm install
```

## Running the tests

How to run the program. Node bamazonCustomer.js will only allow you to act as a customer. You can see all the items for sale. You can choose an item and how many you would like to buy. The program will give you a final price and let the customer know how many are left. 

Node bamazonManager.js will give you more options. You can see all the items for sale. You can see what items are low in inventory. You can add more inventory to each item selected. As well as adding completely new items to the store. 

Below you can see how the app works through gifs


## Demonstration

### bamazonCustomer
![Code Gif](/img/cust-buy.gif)

### bamazonManager view all inventory and low inventory 
![Code Gif](/img/viewall-low.gif)

### bamazonManager add more inventory 
![Code Gif](/img/add-inv.gif)

### bamazonManager add all new inventory
![Code Gif](/img/add-new.gif)


