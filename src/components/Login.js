import React from 'react'
import {
	Form, Icon, Input, Button, message
} from 'antd';
import $ from 'jquery'
import {API_ROOT} from "../constants"
import {Link} from 'react-router-dom'

class NormalLoginForm extends React.Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
			// Send the login info to the backend
			$.ajax({
				url: `${API_ROOT}/login`,
				method: 'POST',
				data: JSON.stringify({
					username: values.username,
					password: values.password,
				})
			}).then((response) => {
				this.props.handleLogin(response);
			}, (error) => {
				message.error(error.responseText);
			}).catch((error) => {
				console.log(error);
			});
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<Form.Item>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Please input your username!' }],
					})(
						<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: 'Please input your Password!' }],
					})(
						<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">
						Log in
					</Button>
					Or <Link to="/register">register now!</Link>
				</Form.Item>
			</Form>
		);
	}
}

export const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);