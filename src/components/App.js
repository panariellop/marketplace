import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from "../abis/Marketplace.json"
import Navbar from "./Navbar"
import Main from "./Main"

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){

   if(window.ethereum){
    window.web3 = new Web3(window.ethereum) 
    await window.ethereum.enable()
   }
   else if(window.web3){
    window.web3 = new Web3(window.web3.currentProvider)
   }
   else {
    window.alert("Non-ethereum browser detected. You should consider using the MetaMask extension.")
   }
  }

  async loadBlockchainData(){
    const accounts = await window.web3.eth.getAccounts()
    this.setState({account: accounts[0] }) 
    const networkID = await window.web3.eth.net.getId()
    const networkData = Marketplace.networks[networkID]
    if(networkData){
      const marketplace = window.web3.eth.Contract(Marketplace.abi, networkData.address) 
      this.setState({marketplace: marketplace})
      const productCount = await marketplace.methods.productCount().call()
      this.setState({productCount})
      //get products 
      this.setState({products: [] })
      for(var i = 1; i<=productCount.toNumber(); i++){
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({loading: false})
    }else{
      window.alert("Marketplace contract not deployed to the detected network")
    }
    
  }

  constructor(props){
    super(props) 
    this.state = {
      account: '', 
      productCount: 0, 
      products: [], 
      loading: true, 
    }
    this.createProduct = this.createProduct.bind(this) 
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }

  async createProduct(name, price){
    this.setState({loading: true})
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.state.setState({loading: false})
    })
    await this.loadBlockchainData()
  }

  async purchaseProduct(id, price){
    this.setState({loading: true})
    this.state.marketplace.methods.purchaseProduct(id).send({from: this.state.account, value: price})
    .once('receipt', (receipt) => {
      this.state.setState({loading: false})
    })
    await this.loadBlockchainData()
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account} /> 
        
        <div className = "container-fluid mt-5">
          <div className = "row">
            <main role = "main" className = "col-lg-12 d-flex">
              { this.state.loading 
                ? <div id = "loader" className = "text-center"><p className = "text-center">Loading...</p></div>
                : <Main 
                    createProduct = {this.createProduct} 
                    products = {this.state.products} 
                    account = {this.state.account}
                    purchaseProduct = {this.purchaseProduct}/> 
              }
            </main>
          </div>
        </div>
        


      </div>
    );
  }
}

export default App;
