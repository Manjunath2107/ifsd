const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

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

  updateShop(index, newName, newRent) {
    const shop = this.shops[index];
    if (shop) {
      shop.name = newName;
      shop.rent = newRent;
      return true;
    }
    return false;
  }

  deleteShop(index) {
    if (index >= 0 && index < this.shops.length) {
      this.shops.splice(index, 1);
      return true;
    }
    return false;
  }

  calculateTotalRent() {
    let totalRent = 0;
    for (let i = 0; i < this.shops.length; i++) {
      totalRent += this.shops[i].rent;
    }
    return totalRent;
  }
}

async function main() {
  const uri = 'mongodb+srv://Manjunath:Ecj76iBoPYhzaJOg@cluster0.ev0e89q.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('shopping_complex');
    const shopsCollection = database.collection('shops');

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

    // Insert all shop data into MongoDB
    await shopsCollection.insertMany(shoppingComplex.shops);

    // Calculate the total rent of all the shops
    const totalRent = shoppingComplex.calculateTotalRent();
    console.log("Total Rent: $" + totalRent);

    // Perform update and delete operations
    const updateIndex = parseInt(prompt("Enter the index of the shop to update:"));
    const newShopName = prompt("Enter the new name for the shop:");
    const newShopRent = parseFloat(prompt("Enter the new rent for the shop:"));
    const updateResult = shoppingComplex.updateShop(updateIndex, newShopName, newShopRent);
    if (updateResult) {
      console.log("Shop updated successfully!");
    } else {
      console.log("Invalid index. Shop update failed.");
    }

    const deleteIndex = parseInt(prompt("Enter the index of the shop to delete:"));
    const deleteResult = shoppingComplex.deleteShop(deleteIndex);
    if (deleteResult) {
      console.log("Shop deleted successfully!");
    } else {
      console.log("Invalid index. Shop deletion failed.");
    }

    // Update the modified shop data in MongoDB
    await shopsCollection.deleteMany({});
    await shopsCollection.insertMany(shoppingComplex.shops);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

main().catch(console.error);
