import React, {Component} from 'react';
import {Button, Form} from 'antd'
import {connect} from 'react-redux'
import {fetchMemoItem, setMemoItem} from '../Action'

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

    render() {
        const blog = this.props.memoItem;

        return (
            <div style={{margin: '2em'}}>
                <Form className="login-form" style={{margin: 10}}>
                    <FormItem>
                        <Button onClick={this.onReturn.bind(this)}>返回</Button>
                    </FormItem>
                </Form>

                <h1>{blog.question}</h1>
                <ReactMarkdown
                    renderers={{code: CodeBlock}}
                    source={blog.answer}/>
            </div>
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
