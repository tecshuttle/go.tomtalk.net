import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Layout, message, Form, Input, Button, Icon, Checkbox} from 'antd'
import {setUser} from '../Action'

const {Footer, Header, Content} = Layout;
const FormItem = Form.Item;

class LoginForm extends Component {
    loginSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let formData = new FormData();
                formData.append('email', values.email);
                formData.append('password', values.password);

                fetch('/api/user/login-submit', {
                    credentials: "same-origin",
                    method: 'POST',
                    body: formData
                }).then((response) => response.json()).then((json) => {
                    if (json.success) {
                        console.log(json);
                        this.props.dispatch(setUser(json));
                        this.props.history.push('/');
                    } else {
                        message.warning(json.msg);
                    }
                }).catch(error => {
                    console.error(error);
                });
            } else {
                console.log(err);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/memo" style={{marginRight: 50}}>Memo</Link>
                    <Link to="/todo">Todo</Link>
                </Header>

                <Content style={{marginTop: '3em', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Form onSubmit={this.loginSubmit} className="login-form" style={{margin: 10, maxWidth: 300}}>
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [
                                    {required: true, message: '请输入邮箱帐号!'},
                                    {type: 'email', message: '请输入有效邮箱账号!'}
                                ],
                            })(
                                <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="注册邮箱"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入登入密码!'},
                                    {min: 3, message: '密码长度不能小于3个字符!'}
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="登入密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" style={{float: 'right'}} href="">忘记密码</a>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}}
                                    className="login-form-button">
                                登入
                            </Button>
                            或者 <a href="">注册!</a>
                        </FormItem>
                    </Form>
                </Content>
                <Footer style={{textAlign: 'center'}}>2018 tomtalk.net</Footer>
            </Layout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
    }
}

LoginForm = connect(mapStateToProps)(LoginForm);
export const Login = Form.create()(LoginForm);