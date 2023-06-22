const express = require('express');
const { MongoClient } = require('mongodb');
const prompt = require('prompt-sync')();

const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb+srv://Manjunath:Ecj76iBoPYhzaJOg@cluster0.ev0e89q.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URL
const dbName = 'shoppingComplex';
const collectionName = 'shops';

// Define Shop and ShoppingComplex classes
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

// Initialize MongoDB client
const client = new MongoClient(url);

// Create an instance of ShoppingComplex
const shoppingComplex = new ShoppingComplex();

// Express routes
app.get('/', (req, res) => {
  res.send('Welcome to the Shopping Complex!');
});

app.get('/addShop', (req, res) => {
  const shopName = prompt("Enter the name of the shop (or 'exit' to finish):");
  if (shopName.toLowerCase() === 'exit') {
    res.send('Shop addition process completed.');
  } else {
    const shopRent = parseFloat(prompt("Enter the rent for the shop:"));
    const shop = new Shop(shopName, shopRent);
    shoppingComplex.addShop(shop);

    // Save the shop to MongoDB
    client.connect((err) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).send('Internal server error');
        return;
      }

      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      collection.insertOne(shop, (err) => {
        if (err) {
          console.error('Error inserting shop into MongoDB:', err);
          res.status(500).send('Internal server error');
          return;
        }

        console.log('Shop added to MongoDB:', shop);
        res.send('Shop added successfully!');
      });
    });
  }
});

app.get('/totalRent', (req, res) => {
  const totalRent = shoppingComplex.calculateTotalRent();
  res.send('Total Rent: $' + totalRent);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
