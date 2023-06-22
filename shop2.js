const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: String,
  rent: Number,
});

const ShopModel = mongoose.model('Shop', shopSchema);

class ShoppingComplex {
  constructor() {
    this.shops = [];
  }

  async addShop(shop) {
    this.shops.push(shop);
    await shop.save();
  }

  async updateShop(index, newName, newRent) {
    const shop = this.shops[index];
    if (shop) {
      shop.name = newName;
      shop.rent = newRent;
      await shop.save();
      return true;
    }
    return false;
  }

  async deleteShop(index) {
    const shop = this.shops[index];
    if (shop) {
      await ShopModel.findByIdAndDelete(shop._id);
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
  await mongoose.connect('mongodb+srv://Manjunath:Ecj76iBoPYhzaJOg@cluster0.ev0e89q.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create shopping complex instance
  const shoppingComplex = new ShoppingComplex();

  // Retrieve existing shops from the database
  const existingShops = await ShopModel.find();
  shoppingComplex.shops = existingShops;

  // Prompt the user to add, update, or delete shops
  while (true) {
    console.log("\n1. Add Shop\n2. Update Shop\n3. Delete Shop\n4. Calculate Total Rent\n5. Exit");
    const choice = parseInt(prompt("Enter your choice:"));

    if (choice === 1) {
      const shopName = prompt("Enter the name of the shop:");
      const shopRent = parseFloat(prompt("Enter the rent for the shop:"));
      const shop = new ShopModel({ name: shopName, rent: shopRent });
      await shoppingComplex.addShop(shop);
      console.log("Shop added successfully!");
    } else if (choice === 2) {
      const index = parseInt(prompt("Enter the index of the shop to update:"));
      const newName = prompt("Enter the new name for the shop:");
      const newRent = parseFloat(prompt("Enter the new rent for the shop:"));
      const updateResult = await shoppingComplex.updateShop(index, newName, newRent);
      if (updateResult) {
        console.log("Shop updated successfully!");
      } else {
        console.log("Invalid index. Shop update failed.");
      }
    } else if (choice === 3) {
      const index = parseInt(prompt("Enter the index of the shop to delete:"));
      const deleteResult = await shoppingComplex.deleteShop(index);
      if (deleteResult) {
        console.log("Shop deleted successfully!");
      } else {
        console.log("Invalid index. Shop deletion failed.");
      }
    } else if (choice === 4) {
      const totalRent = shoppingComplex.calculateTotalRent();
      console.log("Total Rent: $" + totalRent);
    } else if (choice === 5) {
      break;
    } else {
      console.log("Invalid choice. Please try again.");
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
