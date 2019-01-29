import React, {Component} from 'react'
import {Register} from "./Register"
import {Login} from "./Login"
import {Switch, Route, Redirect} from "react-router-dom"
import {Home} from "./Home"

class Main extends Component {
	// redirect user to corresponding pages based on its logged in status
	getLogin = () => {
		return this.props.isLoggedIn ? <Redirect to="/home"/> : <Login handleLogin={this.props.handleLogin}/>;
	};

	getHome = () => {
		return this.props.isLoggedIn ? <Home/> : <Redirect to="/login"/>;
	};

	getRoot = () => {
		return <Redirect to="/login"/>;
	};

	render() {
		return (
			<div className="main">
				<Switch>
					<Route exact path="/" render={this.getRoot}/>
					<Route path="/register" component={Register}/>
					<Route path="/login" render={this.getLogin}/>
					<Route path="/home" render={this.getHome}/>
					<Route render={this.getRoot}/>
				</Switch>
			</div>
		)
	}
}

export {Main}