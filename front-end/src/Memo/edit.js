import React, {Component} from 'react';
import {Button, Form, Input, Select} from 'antd'
import {connect} from 'react-redux'
import Textarea from 'react-textarea-autosize'
import {fetchMemoItem, updateMemoItem, setMemoItem} from '../Action'

const FormItem = Form.Item;
const Option = Select.Option;

//这个是废弃的是类，为了保险起见，过段时间清理。
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
            <Form onSubmit={this.handleSubmit} className="login-form" style={{margin: 10}}>
                <FormItem>
                    {getFieldDecorator('type_id', {
                        initialValue: this.props.memoItem.type_id
                    })(
                        <Select style={{width: '100%'}} placeholder='请选择分类'>
                            <Option value='0'>请选择分类</Option>
                            {
                                this.props.memoCategoryList.items.map((item, idx) => (
                                    <Option value={item.type_id} key={'cat-' + idx}>{item.type}</Option>
                                ))
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem>{getFieldDecorator('question', {})(<Input placeholder="标题"/>)}</FormItem>

                <FormItem>
                    {getFieldDecorator('answer', {})(
                        <Textarea style={{width: '100%', lineHeight: 1.5}} minRows={5} maxRows={18}/>
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" style={{marginRight: 50}}>保存</Button>
                    <Button onClick={this.onReturn.bind(this)}>返回</Button>
                </FormItem>
            </Form>
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

export const MemoEdit = Form.create()(MemoForm);

