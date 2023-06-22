import React from 'react';
import WidgetWrapper from 'components/WidgetWrapper';

class Shop {
  constructor(name, rent) {
    this.name = name;
    this.rent = rent;
  }
}

class ShoppingComplex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      shopName: '',
      shopRent: '',
      totalRent: 0,
      editingIndex: -1,
    };
  }

  addShop = () => {
    const { shops, shopName, shopRent } = this.state;
    const shop = new Shop(shopName, parseFloat(shopRent));
    this.setState({
      shops: [...shops, shop],
      shopName: '',
      shopRent: '',
    });
  };

  updateShop = () => {
    const { shops, shopName, shopRent, editingIndex } = this.state;
    const updatedShops = [...shops];
    updatedShops[editingIndex] = new Shop(shopName, parseFloat(shopRent));
    this.setState({
      shops: updatedShops,
      shopName: '',
      shopRent: '',
      editingIndex: -1,
    });
  };

  deleteShop = (index) => {
    const { shops } = this.state;
    const updatedShops = [...shops];
    updatedShops.splice(index, 1);
    this.setState({ shops: updatedShops });
  };

  calculateTotalRent = () => {
    const { shops } = this.state;
    let totalRent = 0;
    for (let i = 0; i < shops.length; i++) {
      totalRent += shops[i].rent;
    }
    this.setState({ totalRent });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  editShop = (index) => {
    const { shops } = this.state;
    const shop = shops[index];
    this.setState({
      shopName: shop.name,
      shopRent: shop.rent.toString(),
      editingIndex: index,
    });
  };

  render() {
    const { shops, shopName, shopRent, totalRent, editingIndex } = this.state;

    return (
      <WidgetWrapper>
      <div>
        <h2>Shopping Complex</h2>

        <div>
          <label>Shop Name:</label>
          <input
            type="text"
            name="shopName"
            value={shopName}
            onChange={this.handleInputChange}
          />
        </div>

        <div>
          <label>Rent:</label>
          <input
            type="number"
            name="shopRent"
            value={shopRent}
            onChange={this.handleInputChange}
          />
        </div>

        {editingIndex === -1 ? (
          <button onClick={this.addShop}>Add Shop</button>
        ) : (
          <div>
            <button onClick={this.updateShop}>Update Shop</button>
            <button onClick={() => this.setState({ shopName: '', shopRent: '', editingIndex: -1 })}>
              Cancel
            </button>
          </div>
        )}

        <ul>
          {shops.map((shop, index) => (
            <li key={index}>
              {shop.name} - Rent: {shop.rent}
              <button onClick={() => this.editShop(index)}>Edit</button>
              <button onClick={() => this.deleteShop(index)}>Delete</button>
            </li>
          ))}
        </ul>

        <button onClick={this.calculateTotalRent}>Calculate Total Rent</button>
        <p>Total Rent: {totalRent}</p>
      </div>
      </WidgetWrapper>
    );
  }
}

export default ShoppingComplex;