import React from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

const DEFAULT_MESSAGE = 'Please insert the amount and click enter';

class App extends React.Component {
//constructor(props){
//super(props);
//this.state = ({});
//}
  state = { //Defined variables will be put in a constructor automatically (calling super) like above 
    manager: '', //manager of the contract (owner)
    players: [], //current players,
    accounts: [],
    balance: 0, //contract balance
    valueToEnter: '', //the value from input form
    message: DEFAULT_MESSAGE //message to show to user
  };

  async componentDidMount() {
    const contractManager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = web3.utils.fromWei(await web3.eth.getBalance(lottery.options.address), 'ether'); //get balance and convert from Wei to ETH
    const accounts = await web3.eth.getAccounts();

    this.setState({ 
      manager: contractManager, 
      players: players,
      accounts: accounts, 
      balance: balance
    });
  }

  enterLottery = async (event) => {
    event.preventDefault(); //This will prevent default submission

    try{
      this.setState({message: 'Waiting on transaction to succeed..'});

      await lottery.methods.enter().send({ from: this.state.accounts[0], value: web3.utils.toWei(this.state.valueToEnter, 'ether') });
      
      this.componentDidMount();
      this.setState({message: 'Operation completed, thanks!'});
    } catch(err) {
      this.setState({message: 'Some error occurred. Please be sure to put > 0.1 eth and to confirm the transaction'});
    }
    
  }

  pickWinner = async (event) => {
    try{
      this.setState({message: 'I will pick the winner for you. Please confirm the transaction'});
      //Need an account to send the transaction (and pay fees)
  
      await lottery.methods.pickWinner().send({ from: this.state.accounts[0] }); //From need to be the contract manager
  
      const winner = await lottery.methods.lastWinner().call();

      const message = 'The winner is ' + winner + ', congratulations! ' + this.state.balance + ' ETH are on their way!';
      this.setState({message: message, players: [], balance: ''});
    } catch(err) {
      this.setState({message: 'Some error occurred when sending the transaction'});
    }
  }

  render() {
    const isManager = this.state.accounts[0] === this.state.manager;
    
    let pickWinnerButton;
    if(isManager) pickWinnerButton = <div><h4>Ready to pick a winner?</h4><button onClick={this.pickWinner}>Pick Winner</button></div>;
    else pickWinnerButton = <div></div>;
    
    return (
      <div className="App">
        <header className="App-header">
          <h2>Welcome to Lottery</h2>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Manager is: {this.state.manager}
          </p>
          <p>
            {this.state.players.length} player(s) are competing to win: {this.state.balance} ETH
          </p>
          <p style={{ color: 'red' }}>{this.state.message}</p>
          <form onSubmit={this.enterLottery}>
            <div>
              <label>Amount of ether</label><br/>
              <input
                value = {this.state.value}
                onChange={event => this.setState({ valueToEnter: event.target.value})}
              >
              </input>
              <button>Enter the lottery!</button>
            </div>
          </form>
          {pickWinnerButton}
        </header>
      </div>

    );
  }
}

export default App;
