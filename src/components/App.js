import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from "../abis/Marketplace.json"
import Navbar from "./Navbar"

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
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account} /> 
        
        <div className = "container-fluid mt-5">
          <div className = "row">
            <main role = "main" className = "col-lg-12 d-flex">
              <div id = "content">
                <h1>Add Product</h1> 
              </div>
            </main>
          </div>
        </div>
        


      </div>
    );
  }
}

export default App;
