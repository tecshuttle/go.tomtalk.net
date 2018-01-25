import React, {Component} from 'react'
import {Icon, Form, Card, Input, Select, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'

const {Meta} = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const ReactMarkdown = require('react-markdown');

export class CardM_ extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
        };

        this.onEdit = this.onEdit.bind(this);
    }

    componentDidUpdate() {
        if (this.props.isotopeInstance !== undefined) {
            this.props.isotopeInstance.arrange();
        }
    }

    onDelete(id) {
        this.props.dispatch(deleteMemoItem(id));
    }

    onInBox(id) {
        this.props.dispatch(inBoxMemoItem(id));
    }

    setModule(module) {
        this.props.item.module = module;
        this.props.dispatch(updateMemoItem(this.props.item));
    }

    onEdit() {
        this.setState({isEdit: true});
    }

    up() {
        this.setState({isEdit: false});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(updateMemoItem({...this.props.item, ...values}));
            } else {
                console.log(err);
            }

            this.up()
        });
    };

    emptyCard(item) {
        return <Card style={styles.style} bodyStyle={styles.bodyStyle}>
            <Icon type="tag-o" onClick={() => this.setModule('memo')} style={styles.emptyCardIcon}/>
            <Icon type="file-text" onClick={() => this.setModule('blog')} style={styles.emptyCardIcon}/>
            <Icon type="camera-o" onClick={() => this.setModule('photo')} style={styles.emptyCardIcon}/>
            <Icon type="delete" onClick={() => this.onDelete(item.id)}
                  style={{...styles.emptyCardIcon, color: 'red', float: 'right'}}/>
        </Card>;
    }

    photoCard(item) {
        const img = <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>;
        const confirm = <Popconfirm title="真要删除图片吗？" onConfirm={() => this.onDelete(item.id)} okText="坚决删除"
                                    cancelText="还是算了">
            <Icon type="delete"/>
        </Popconfirm>;
        const title = <div><span>Europe Street beat</span>{confirm}</div>;

        return <Card style={styles.style} cover={img}>
            <Meta title={title} description="www.instagram.com"/>
        </Card>;
    }

    blogCard(item) {
        const delBtn = (item.question === '' && item.answer === '' ?
            <Icon type="delete" onClick={() => this.onDelete(item.id)}/> : '');
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;
        const color = (item.color === null ? '#000000' : '#' + item.color);

        return <Card style={{...styles.style, color: color}}
                     title={<span style={{color: color}}><Icon
                         type='file-text'/>{item.type} 字数：{item.answer.length}</span>}
                     extra={<div>{delBtn}{editBtn}</div>}>
            <h2 style={{cursor: 'pointer'}} onClick={() => this.props.blogShow(item.id)}>{item.question}</h2>
        </Card>;
    }

    memoCard(item) {
        const {getFieldDecorator} = this.props.form;
        const color = (item.color === null ? '#000000' : '#' + item.color);
        const delBtn = (item.question === '' && item.answer === '' ?
                <Icon type="delete" style={{fontSize: 18, marginRight: 20}} onClick={() => this.onDelete(item.id)}/>
                : ''
        );
        //const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;
        const editBtn = <Icon type="edit" onClick={this.onEdit} style={{fontSize: 18, marginLeft: 20}}/>;
        const title = <span style={{color: color}}>
            <Icon type='tag'/>
            {item.type === null ? "" : ' ' + item.type + ' '} {item.question}
            </span>;

        if (this.state.isEdit) {
            return <Card style={{...styles.style, color: color}}
                         title={title}
                         extra={<div>
                             <Icon type="save" onClick={this.handleSubmit} style={{fontSize: 18, marginRight: 20}}/>
                             <Icon type="up" onClick={() => this.up()} style={{fontSize: 18}}/>
                         </div>}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('type_id', {
                            initialValue: item.type_id
                        })(
                            <Select style={{width: '100%'}} placeholder='请选择分类'>
                                <Option value='0'>请选择分类</Option>
                                {
                                    this.props.memoCategoryList.items.map((item, idx) => (
                                        <Option value={item.type_id}
                                                key={'cat-' + idx}>{item.type} {item.count}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('question', {
                            initialValue: item.question
                        })(
                            <TextArea placeholder="工作内容"
                                      autosize={true}/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('answer', {
                            initialValue: item.answer
                        })(
                            <TextArea placeholder="工作内容"
                                      autosize={true}/>
                        )}
                    </FormItem>
                </Form>
            </Card>;
        } else {
            return <Card style={{...styles.style, color: color}}
                         title={title}
                         extra={<div>
                             {delBtn}
                             <Icon type="inbox" onClick={() => this.onInBox(item.id)} style={{fontSize: 18}}/>
                             {editBtn}
                         </div>}>
                <ReactMarkdown style={{color: color}} source={item.answer}/>
            </Card>;
        }
    }

    createCard(item) {
        switch (item.module) {
            case  'photo':
                return this.photoCard(item);
            case  'blog':
                return this.blogCard(item);
            default:
                return this.memoCard(item);
        }
    }

    render() {
        const item = this.props.item;
        return this.props.type === 'empty' ? this.emptyCard(item) : this.createCard(item);
    }
}

const styles = {
    style: {
        width: 300,
        marginRight: 10,
        marginBottom: 10
    },
    bodyStyle: {
        color: '#333333',
        padding: 5
    },
    emptyCardIcon: {
        fontSize: 30,
        marginLeft: 20
    }
};

function mapStateToProps(state, ownProps) {
    return {
        memoCategoryList: state.memoCategoryList,
    }
}

const CardM__ = connect(mapStateToProps)(CardM_);

const CardForm = Form.create()(CardM__);

export const CardM = connect()(CardForm);
