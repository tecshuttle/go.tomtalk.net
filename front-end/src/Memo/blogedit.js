import React, {Component} from 'react';
import {Layout, Button, Form, Input, Select} from 'antd'
import {connect} from 'react-redux'
import {fetchMemoItem, updateMemoItem, setMemoItem} from '../Action'

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const {Content} = Layout;
const Option = Select.Option;
const ReactMarkdown = require('react-markdown');
const CodeBlock = require('./code-block');

export class MemoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needLoad: true,
            blog: '',
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
        this.setState({blog: this.props.memoItem.answer});

        this.props.form.setFieldsValue({
            //question: this.props.memoItem.question,
            answer: this.props.memoItem.answer,
        });
    }

    onReturn() {
        this.setState({needLoad: true});
        this.props.history.goBack();
    }

    onSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(updateMemoItem(this.props.parent, {...this.props.memoItem, ...values}));
            } else {
                console.log(err);
            }

            this.props.history.goBack();
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Layout>
                <Content>
                    <Form onSubmit={this.onSave} layout="inline">
                        <div style={{margin: 10}}>
                            <FormItem>
                                {getFieldDecorator('type_id', {
                                    initialValue: this.props.memoItem.type_id
                                })(
                                    <Select style={{width: 200}} placeholder='请选择分类'>
                                        <Option value='0'>请选择分类</Option>
                                        {
                                            this.props.memoCategoryList.items.map((item, idx) => (
                                                <Option value={item.type_id} key={'cat-' + idx}>{item.type}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit">保存</Button>
                            </FormItem>

                            <FormItem>
                                <Button onClick={this.onReturn.bind(this)}>返回</Button>
                            </FormItem>
                        </div>

                        <div>
                            {getFieldDecorator('answer', {})(
                                <TextArea style={styles.memoTextarea} onChange={e => this.setState({blog: e.target.value})}/>
                            )}
                            <div style={styles.preview}>
                                <ReactMarkdown
                                    renderers={{code: CodeBlock}}
                                    source={this.state.blog}/>
                            </div>
                        </div>


                    </Form>
                </Content>
            </Layout>
        )
    }
}

const styles = {
    memoTextarea: {
        resize: 'none',
        position: 'absolute',
        borderWidth: 0,
        bottom: 0,
        top: 59,
        width: '50%',
        lineHeight: 1.5,
        borderRightWidth: 1,
        borderRightColor: '#eeeeee',
        padding: '1em',
        borderRadius: 0,
    },
    preview: {
        padding: '1em',
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: 59,
        width: '50%',
        overflow: 'auto',
        lineHeight: 1.5,
    }
};

function mapStateToProps(state, ownProps) {
    return {
        memoCategoryList: state.memoCategoryList,
        memoItem: state.memoItem,
        memoList: state.memoList
    }

}

MemoForm = connect(mapStateToProps)(MemoForm);

export const BlogEdit = Form.create()(MemoForm);

