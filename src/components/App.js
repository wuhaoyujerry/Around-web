import React, { Component } from 'react';
import {Header} from "./Header";
import {Main} from "./Main";
import {TOKEN_KEY} from "../constants";
import '../styles/App.css';

class App extends Component {
	state = {
		isLoggedIn: !!localStorage.getItem("TOKEN_KEY"),
	}

	// If the user is already logged in, set the variable to true
	handleLogin = (token) => {
		localStorage.setItem(TOKEN_KEY, token);
		this.setState({isLoggedIn: true});
	};

	// If the user logged out, set the variable to false
	handleLogout = () => {
		localStorage.removeItem(TOKEN_KEY);
		this.setState({isLoggedIn: false});
	}

	render() {
		return (
			<div className="App">
				<Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
				<Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
			</div>
		);
	}
}

export default App;
