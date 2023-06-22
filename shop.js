const prompt = require('prompt-sync')();
class Shop {
    constructor(name, rent) {
      this.name = name;
      this.rent = rent;
    }
  }
  
  class ShoppingComplex {
    constructor() {
      this.shops = [];
    }
  
    addShop(shop) {
      this.shops.push(shop);
    }
  
    calculateTotalRent() {
      let totalRent = 0;
      for (let i = 0; i < this.shops.length; i++) {
        totalRent += this.shops[i].rent;
      }
      return totalRent;
    }
  }
  
  // Create shopping complex instance
  const shoppingComplex = new ShoppingComplex();
  
  // Prompt the user to add shops and their rents
  while (true) {
    const shopName = prompt("Enter the name of the shop (or 'exit' to finish):");
    if (shopName.toLowerCase() === "exit") {
      break;
    }
    const shopRent = parseFloat(prompt("Enter the rent for the shop:"));
    const shop = new Shop(shopName, shopRent);
    shoppingComplex.addShop(shop);
  }
  
  // Calculate the total rent of all the shops
  const totalRent = shoppingComplex.calculateTotalRent();
  console.log("Total Rent: $" + totalRent);
  