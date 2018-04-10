import React, {Component} from 'react';
import {Layout, Button, Form} from 'antd'
import {connect} from 'react-redux'
import {fetchMemoItem, setMemoItem, inBoxMemoItem, checkLogin} from '../Action'

const {Content} = Layout;
const FormItem = Form.Item;
const ReactMarkdown = require('react-markdown');
const CodeBlock = require('./code-block');

export class MemoForm extends Component {
    componentWillMount() {
        if (this.props.memoList.items.length === 0) {
            this.props.dispatch(fetchMemoItem(this.props.match.params.id));
        } else {
            this.props.dispatch(setMemoItem(this.props.match.params.id));
        }

        this.props.dispatch(checkLogin());
    }

    componentDidUpdate(prevProps) {
    }

    onReturn() {
        this.props.history.goBack();
    }

    onEdit() {
        this.props.history.push('/blog/edit/' + this.props.memoItem.id);
    }

    onInBox() {
        this.props.dispatch(inBoxMemoItem(this.props.memoItem.id));
        this.props.history.push('/memo');
    }

    render() {
        const blog = this.props.memoItem;
        document.title = blog.question === '' ? blog.answer.split('\n')[0].substr(1) : blog.question;
        const user = this.props.user;

        return (
            <Layout style={{backgroundColor: '#ffffff'}}>
                {
                    user.uid !== 0 ?
                        <div style={{marginLeft: '1em', marginRight: '1em', marginTop: '1em'}}>
                            <Form className="login-form">
                                <FormItem style={{margin: 0}}>
                                    <Button onClick={this.onReturn.bind(this)}>返回</Button>
                                    <Button onClick={this.onInBox.bind(this)} style={{marginLeft: '1em', marginRight: '1em'}}>归档</Button>
                                    <Button onClick={this.onEdit.bind(this)}>编辑</Button>
                                </FormItem>
                            </Form>
                        </div>
                        : null
                }

                <Content id='blog-markdown'>
                    <h1>{blog.question}</h1>
                    <ReactMarkdown
                        renderers={{code: CodeBlock}}
                        source={blog.answer}/>
                </Content>
            </Layout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        memoCategoryList: state.memoCategoryList,
        memoItem: state.memoItem,
        memoList: state.memoList,
        user: state.user,
    }
}

MemoForm = connect(mapStateToProps)(MemoForm);
export const BlogShow = Form.create()(MemoForm);
