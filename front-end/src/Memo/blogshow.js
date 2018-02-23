import React, {Component} from 'react';
import {Layout, Button, Form} from 'antd'
import {connect} from 'react-redux'
import {fetchMemoItem, setMemoItem, inBoxMemoItem} from '../Action'

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

        return (
            <Layout style={{backgroundColor: '#ffffff'}}>
                <div style={{marginLeft: '2em', marginRight: '2em', marginTop: '1em'}}>
                    <Form className="login-form">
                        <FormItem>
                            <Button onClick={this.onReturn.bind(this)}>返回</Button>
                            <Button onClick={this.onInBox.bind(this)} style={{marginLeft: '1em', marginRight: '1em'}}>归档</Button>
                            <Button onClick={this.onEdit.bind(this)}>编辑</Button>
                        </FormItem>
                    </Form>
                </div>

                <Content style={{marginLeft: '2em', marginRight: '2em', marginBottom: '1em'}}>
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
        memoList: state.memoList
    }
}

MemoForm = connect(mapStateToProps)(MemoForm);
export const BlogShow = Form.create()(MemoForm);
