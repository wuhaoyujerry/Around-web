import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm';
import { API_ROOT, POS_KEY, AUTH_PREFIX, TOKEN_KEY } from '../constants';
export class CreatePostButton extends React.Component {
	state = {
		visible: false,
		confirmLoading: false,
	}
	showModal = () => {
		this.setState({
			visible: true,
		});
	}

	handleOk = () => {
		this.form.validateFields((err, values) => {
			if (!err) {
				const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
				const file = values.image[0];

				const formData = new FormData();
				formData.set('lat', lat + Math.random() * 0.1 - 0.05);
				formData.set('lon', lon + Math.random() * 0.1 - 0.05);
				formData.set('message', values.message);
				for (let i in file) {
					formData.append('image', file[i], i);
				}

				this.setState({ confirmLoading: true });
				$.ajax({
					url: `${API_ROOT}/post`,
					method: 'POST',
					data: formData,
					headers: {
						Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
					},
					processData: false,
					contentType: false,
					dataType: 'text',
				}).then((response) => {
					message.success('created a post successfully.');
				}, (error) => {
					message.error(error.responseText);
				}).then(() => {
					this.form.resetFields();
					this.props.loadNearbyPosts().then(() => {
						this.setState({ visible: false, confirmLoading: false });
					});
				}).catch((error) => {
					message.error('create post failed');
					console.log(error);
				});
			}
		});
	}
	handleCancel = () => {
		console.log('Clicked cancel button');
		this.setState({
			visible: false,
		});
	}
	saveFormRef = (form) => {
		this.form = form;
	}
	render() {
		const { visible, confirmLoading } = this.state;
		return (
			<div>
				<Button type="primary" onClick={this.showModal}>Create New Post</Button>
				<Modal title="Create New Post"
				       visible={visible}
				       onOk={this.handleOk}
				       okText="Create"
				       confirmLoading={confirmLoading}
				       onCancel={this.handleCancel}
				       cancelText="Cancel"
				>
					<WrappedCreatePostForm ref={this.saveFormRef}/>
				</Modal>
			</div>
		);
	}
}
