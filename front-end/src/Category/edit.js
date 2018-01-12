import React, {Component} from 'react';
import {Button, Form, Input, InputNumber} from 'antd'
import {connect} from 'react-redux'
import {fetchCategoryItem, updateCategoryItem, setCategoryItem} from '../Action'

const FormItem = Form.Item;

export class CategoryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needLoad: true,
        }
    }

    componentDidMount() {
        if (this.props.categoryList.items.length === 0) {
            this.props.dispatch(fetchCategoryItem(this.props.match.params.typeId)).then(() => {
                this.setFieldsValue();
            });
        } else {
            if (this.props.match.params.id === undefined) {
                this.setFieldsValue();
            } else {
                this.props.dispatch(setCategoryItem(this.props.match.params.id));
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryItem.id !== 0 && this.state.needLoad) {
            this.setFieldsValue();
            this.setState({needLoad: false});
        }
    }

    setFieldsValue() {
        console.log(this.props.categoryItem);
        this.props.form.setFieldsValue({
            color_: this.props.categoryItem.color,
            color: this.props.categoryItem.color,
            name: this.props.categoryItem.name,
            priority: this.props.categoryItem.priority,
        });
    }

    onReturn() {
        this.setState({needLoad: true});
        this.props.history.goBack();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
            } else {
                delete  values.color_;  // 为数据干净些，不给state传颜色指示器变量。
                values.color = values.color.replace(/#/, ''); // 数据库里存的是不变#号的颜色。todo: 修改规则，数据库存带#号的颜色。
                this.props.dispatch(updateCategoryItem({...this.props.categoryItem, ...values}));
                this.props.history.goBack();
            }
        });
    };

    onChangeColor = (e) => {
        this.props.form.setFieldsValue({
            color: e.target.value,
            color_: e.target.value
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" style={{margin: 10}}>
                <FormItem>
                    {getFieldDecorator('color_', {})(<Input type="color" onChange={this.onChangeColor}/>)}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('color', {
                        rules: [{required: true, message: '请指定标识颜色！'}],
                    })(
                        <Input onChange={this.onChangeColor} placeholder="标识颜色"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('priority', {
                        rules: [{required: true, message: '请指定显示顺序！'}],
                    })(
                        <InputNumber min={1} style={{width: '100%'}} placeholder='显示顺序'/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请指定分类名称！'}],
                    })(
                        <Input placeholder="分类名"/>
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
        categoryItem: state.categoryItem,
        categoryList: state.categoryList
    }
}

CategoryForm = connect(mapStateToProps)(CategoryForm);
export const CategoryEdit = Form.create()(CategoryForm);
