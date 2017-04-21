var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});
var whatItem = {
    type: 'input',
    name: 'which',
    message: 'Which item would you like to purchase?<br>'
};
var whatQuantity = {
    type: 'input',
    name: 'quantity',
    message: 'How many of this item would you like to purchase?<br>',
};
connection.connect(function(err){
    if(err){
        throw err;
    };
    // console.log("connected as id "+ connection.threadId+);
});

var products = []; 
var prices = []; 
var quantities = [];
var itemBeingBought;
var quantitySold;
var itemIndex;

function displayProducts(){
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        var text ='id# | Product Name | Department | Price | Quantity \n';
        for(var i = 0; i<results.length; i++){
            text += results[i].item_id + '\xa0\xa0 | \xa0';
            text += results[i].product_name + '\xa0 | \xa0';
            text += results[i].department_name + '\xa0 | $';
            text += results[i].price + '\xa0 | ';
            text += results[i].stock_quantity + '\n';
            products.push(results[i].product_name);
            prices.push(results[i].price);
            quantities.push(results[i].stock_quantity);
        };
        console.log(text);
    });
    getItem();
}

function getItem(){
    inquirer.prompt(whatItem).then(function(response){
        itemBeingBought = response.which;
        console.log('You want to buy ' + itemBeingBought);
        getQuantity();
    })
};

function getQuantity(){
    inquirer.prompt(whatQuantity).then(function(response){
        quantitySold = response.quantity; 
        console.log('You want to purchase '+quantitySold+ " "+itemBeingBought+'(s).');
        checkItemAndQuantity();
    });
};

function checkItemAndQuantity(){
    if(products.indexOf(itemBeingBought) <= -1){
        console.log('That item is not available. Try entering another item or typing your item name more carefully');
    }else{
        itemIndex = products.indexOf(itemBeingBought);
        console.log(itemIndex);
        if(quantitySold > quantities[itemIndex]){
            console.log('There are not enough '+ itemBeingBought + ' in stock for us to be able to complete your purchase.');
        } else {
            console.log('Perfect. We have that in stock.');
            updateSql(itemBeingBought, quantitySold);
        }
    }
    displayProducts();
};

function updateSql(prodOrdered, quantOrdered){
    connection.query(
        'UPDATE products SET stock_quantity = ? WHERE product_name = ?',
         [(quantities[itemIndex]-quantOrdered), prodOrdered],
         function (error, results, fields) {
            if (error) throw error;
    // ... 
    });
}
    
function initializeApp(){
    displayProducts();
}

initializeApp();

