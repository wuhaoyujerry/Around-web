import React from 'react'
import { Tabs, Spin} from 'antd';
import {GEO_OPTIONS, TOKEN_KEY} from "../constants"
import $ from 'jquery'
import {API_ROOT, AUTH_PREFIX, POS_KEY} from "../constants"
import {Gallery} from "./Gallery"
import {CreatePostButton} from "./CreatePostButton"
import {WrappedAroundMap} from "./AroundMap"

const TabPane = Tabs.TabPane;

class Home extends React.Component {
	state = {
		loadingPosts: false,
		loadingGeoLocation : false,
		error : "",
		posts: [],
	}

	getGeoLocation = () => {
		// get the geo location if the browser support it
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(this.onSuccessGetGeoLocation, this.onFailedLoadGeoLocation, GEO_OPTIONS);
		} else {
			/* geolocation IS NOT available */
			this.setState({ error: 'Your browser does not support geolocation!'});
		}
	}

	onSuccessGetGeoLocation = (position) => {
		console.log(position);
		this.setState({loadingGeoLocation : false, error : ""});
		const { latitude: lat, longitude: lon } = position.coords;
		const location = { lat, lon };
		localStorage.setItem(POS_KEY, JSON.stringify(location));
		this.loadNearbyPosts(location);
	}

	onFailedLoadGeoLocation = () => {
		this.setState({loadGeoLocation : false, error : 'Failed to load geo location!'});
		console.log("Fail to get geo location");
	}

	componentDidMount() {
		this.setState({loadingGeoLocation : true});
		this.getGeoLocation();
	}

	getGalleryPanelContent = () => {
		if (this.state.error) {
			return <div>{this.state.error}</div>;
		} else if (this.state.loadingGeoLocation) {
			return <Spin tip="Loading geo location..."/>
		} else if (this.state.loadingPosts) {
			return <Spin tip="Loading posts..."/>
		} else if (this.state.posts && this.state.posts.length > 0) {
			const image = this.state.posts.map((post) => {
				return {
					user: post.user,
					src: post.url,
					thumbnail: post.url,
					caption: post.message,
					thumbnailWidth: 400,
					thumbnailHeight: 300,
				}
			});
			return <Gallery images={image}/>;
		} else {
			return null;
		}
	}

	loadNearbyPosts = (location, radius) => {
		const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
		const range = radius ? radius : 20;
		this.setState({loadingPosts: true, error: ''});
		return $.ajax({
			url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=200`,
			method: 'GET',
			headers: {
				Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
			},
		}).then((response) => {
			this.setState({ posts: response, loadingPosts: false, error: '' });
			console.log(response);
		}, (error) => {
			this.setState({ loadingPosts: false, error: error.responseText });
			console.log(error);
		}).catch((error) => {
			console.log(error);
		});
	}

	render() {
		const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
		return (
			<Tabs tabBarExtraContent={createPostButton} className="main-tab">
				<TabPane tab="Posts" key="1">
					{this.getGalleryPanelContent()}
				</TabPane>
				<TabPane tab="Map" key="2">
					<WrappedAroundMap
						googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5lHxxFSR_JpIEkU7bcc1F1_8d8lexkMA&v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<div style={{ height: `100%` }} />}
						containerElement={<div style={{ height: `400px` }} />}
						mapElement={<div style={{ height: `100%` }} />}
					/>
				</TabPane>
			</Tabs>
		);
	}
}

export {Home}