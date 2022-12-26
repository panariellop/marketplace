pragma solidity ^0.5.0; 

contract Marketplace{
    string public name; 
    uint public productCount = 0; //how many products exist inside the mapping 
    mapping(uint => Product) public products; //same as a dictionary / hashtable 

    struct Product {
        uint id; 
        string name; 
        uint price; 
        address owner; 
        bool purchased; 
    }

    event ProductCreated(
        uint id,
        string name, 
        uint price,
        address owner, 
        bool purchased
    ); 

    constructor() public {
        name = "Piero's Marketplace"; 
    }

    function createProduct(string memory _name, uint _price) public {
        // require a valid name
        require(bytes(_name).length > 0); 
        //require a valid price 
        require(_price > 0 ); 
        // incriment product count 
        productCount ++; 
        // create the product 
        products[productCount] = Product(productCount, _name, _price, msg.sender, false); 
        // trigger an event
        // can be used to console log 
        emit ProductCreated(productCount, _name, _price, msg.sender, false); 


    }

    function purchaseProduct(uint _id) public {
        // fetch the product 
        // fetch the owner 
        // make sure the product is valid 
        // purchase the product 
        // trigger an event 

    }
}