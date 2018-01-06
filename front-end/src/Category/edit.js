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

    componentWillMount() {
        if (this.props.categoryList.items.length === 0) {
            this.props.dispatch(fetchCategoryItem(this.props.match.params.typeId)).then(() => {
                this.setFieldsValue();
            });
        } else {
            this.props.dispatch(setCategoryItem(this.props.match.params.typeId));
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryItem.type_id !== 0 && this.state.needLoad) {
            this.setFieldsValue();
            this.setState({needLoad: false});
        }
    }

    setFieldsValue() {
        this.props.form.setFieldsValue({
            color_: this.props.categoryItem.color,
            color: this.props.categoryItem.color,
            type: this.props.categoryItem.type,
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
            if (!err) {
                delete  values.color_;  // 为数据干净些，不给state传颜色指示器变量。
                values.color = values.color.replace(/#/, ''); // 数据库里存的是不变#号的颜色。todo: 修改规则，数据库存带#号的颜色。
                this.props.dispatch(updateCategoryItem({...this.props.categoryItem, ...values}));
            } else {
                console.log(err);
            }

            this.props.history.goBack();
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
            <div style={{margin: 10}}>
                <h3>type_id: {this.props.match.params.typeId}</h3>

                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('color_', {})(
                            <Input type="color" onChange={this.onChangeColor}/>
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('color', {})(
                            <Input onChange={this.onChangeColor} placeholder="标识颜色"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('priority', {})(
                            <InputNumber min={0} style={{width: '100%'}}/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('type', {
                            rules: [{required: true, message: '请指定分类名称！'}],
                        })(
                            <Input onChange={this.onChangeName} placeholder="分类名"/>
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
        categoryItem: state.categoryItem,
        categoryList: state.categoryList
    }

}

CategoryForm = connect(mapStateToProps)(CategoryForm);

export const CategoryEdit = Form.create()(CategoryForm);

