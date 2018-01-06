import React, {Component} from 'react';
import {Button, Form, Input} from 'antd'
import {connect} from 'react-redux'
import Textarea from 'react-textarea-autosize'
import {fetchMemoItem, updateMemoItem, setMemoItem} from '../Action'

const FormItem = Form.Item;

export class MemoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needLoad: true,
        }
    }

    componentWillMount() {
        if (this.props.memoList.items.length === 0) {
            this.props.dispatch(fetchMemoItem(this.props.match.params.id)).then(() => {
                this.setFieldsValue();
            });
        } else {
            this.props.dispatch(setMemoItem(this.props.match.params.id));
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.memoItem.id !== 0 && this.state.needLoad) {
            this.setFieldsValue();
            this.setState({needLoad: false});
        }
    }

    setFieldsValue() {
        this.props.form.setFieldsValue({
            question: this.props.memoItem.question,
            answer: this.props.memoItem.answer,
        });
    }

    onReturn() {
        this.setState({needLoad: true});
        this.props.history.goBack();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(updateMemoItem({...this.props.memoItem, ...values}));
            } else {
                console.log(err);
            }

            this.props.history.goBack();
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div style={{margin: 10}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('question', {})(
                            <Input placeholder="标题"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('answer', {})(
                            <Textarea
                                style={{width: '100%', lineHeight: 1.5}}
                                minRows={5} maxRows={18}/>
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit" style={{marginRight: 50}}>保存</Button>
                        <Button onClick={this.onReturn.bind(this)}>返回</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        memoItem: state.memoItem,
        memoList: state.memoList
    }

}

MemoForm = connect(mapStateToProps)(MemoForm);

export const MemoEdit = Form.create()(MemoForm);

