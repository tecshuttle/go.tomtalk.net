import React, {Component} from 'react'
import {Icon, Form, Card, Select, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'
import Textarea from 'react-textarea-autosize'

const {Meta} = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const ReactMarkdown = require('react-markdown');

export class CardM_ extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            isHover: false,
        };

        this.onEdit = this.onEdit.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
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
        this.setState({isEdit: true, isHover: true});
    }

    up() {
        this.setState({isEdit: false, isHover: false});
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
                <Icon type="delete" style={{fontSize: 22, cursor: 'pointer'}}
                      onClick={() => this.onDelete(item.id)}/>
                : ''
        );
        const editBtn = <Icon type="edit" onClick={this.onEdit}
                              style={{fontSize: 22, cursor: 'pointer'}}/>;

        const saveBtn = <Icon type="save" onClick={this.handleSubmit} style={{fontSize: 22, cursor: 'pointer'}}/>
        let inboxBtn = <Icon type="inbox"
                             onClick={() => this.onInBox(item.id)}
                             style={{fontSize: 22, cursor: 'pointer'}}/>
        const upBtn = <Icon type="up" onClick={() => this.up()} style={{fontSize: 22, cursor: 'pointer'}}/>


        let boxShadow = '0 1px 4px rgba(1, 1, 1, .15)';


        if (this.state.isHover) {
            boxShadow = '0 1px 5px rgba(1, 1, 1, .3)';
        }

        if (this.state.isEdit) {
            return <div style={{...styles.memoCard, boxShadow: boxShadow, color: color}}>
                <ToolBarEdit save={saveBtn} up={upBtn} inbox={inboxBtn}/>
                <Form onSubmit={this.handleSubmit} style={{margin: 0, padding: '0.6em 0.8em 0.5em 0.8em'}}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator('type_id', {
                            initialValue: item.type_id
                        })(
                            <Select style={{width: '100%'}} placeholder='请选择分类'>
                                <Option value='0'>请选择分类</Option>
                                {this.props.memoCategoryList.items.map((item, idx) => (
                                    <Option value={item.type_id} key={'cat-' + idx}>{item.type} {item.count}</Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <div style={{marginBottom: 0}}>
                        {getFieldDecorator('question', {
                            initialValue: item.question
                        })(
                            <Textarea placeholder="标题"
                                      style={styles.memoTextarea}
                                      onHeightChange={(height, instance) => {
                                          this.props.isotopeInstance.arrange();
                                      }}/>
                        )}
                    </div>
                    <div style={{marginBottom: 0}}>
                        {getFieldDecorator('answer', {
                            initialValue: item.answer
                        })(
                            <Textarea placeholder="内容"
                                      style={styles.memoTextarea}
                                      onHeightChange={(height, instance) => {
                                          this.props.isotopeInstance.arrange();
                                      }}
                            />
                        )}
                    </div>
                </Form>
            </div>;
        } else {
            /* 也许可以放在标题下，指示分类及添加日期，编辑次数。
            const title = <span style={{color: color}}>
            <Icon type='tag'/>
                {item.type === null ? "" : ' ' + item.type + ' '} {item.question}
            </span>;*/

            return <div style={{...styles.memoCard, color: color, boxShadow: boxShadow, cursor: 'pointer'}}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        onClick={this.onEdit}>
                <MemoContent memo={item}/>
                <ToolBar state={this.state} memo={item} edit={editBtn} del={delBtn} inbox={inboxBtn}/>
            </div>;
        }
    }

    emptyCard(item) {
        return <Card style={styles.style} bodyStyle={styles.bodyStyle}>
            <Icon type="tag-o" onClick={() => this.setModule('memo')} style={styles.emptyCardIcon}/>
            <Icon type="file-text" onClick={() => this.setModule('blog')} style={styles.emptyCardIcon}/>
            <Icon type="camera-o" onClick={() => this.setModule('photo')} style={styles.emptyCardIcon}/>
            <Icon type="delete" onClick={() => this.onDelete(item.id)}
                  style={{...styles.emptyCardIcon, color: 'red', float: 'right'}}/>
        </Card>;
    }

    onMouseEnter = (e) => {
        //e.preventDefault();
        this.setState({isHover: true});
    }

    onMouseLeave = (e) => {
        //e.preventDefault();
        this.setState({isHover: false});
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

function isMemoEmpty(memo) {
    return (memo.question === '' && memo.answer === '')
}

function MemoContent(props) {
    if (isMemoEmpty(props.memo)) {
        return <p>empty memo</p>
    }

    const color = (props.memo.color === null ? '#000000' : '#' + props.memo.color);

    let question = <div style={{
        fontWeight: 'bold',
        fontSize: '1.2em',
        paddingBottom: '0.5em',
        pointerEevents: 'none'
    }}>{props.memo.question}</div>;

    if (props.memo.question === '') {
        question = null;
    }

    return <div style={{padding: '1em 1em 0 1em'}}>
        {question}
        <ReactMarkdown style={{color: color}} source={props.memo.answer}/>
    </div>
}

function ToolBar(props) {
    const toolbar = <div style={{
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffffff',
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0.5em 1em',
    }}>
        {props.inbox}
        {props.del}
        {props.edit}
    </div>;

    //如果内容为空则直接显示工具条。
    if (isMemoEmpty(props.memo)) {
        return toolbar
    } else {
        return null
    }
}

function ToolBarEdit(props) {
    return <div style={{
        //position: 'absolute',
        //bottom: 0,
        backgroundColor: '#ffffff',
        width: '100%',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0.5em 1em',
    }}>
        {props.up}
        {props.inbox}
        {props.save}
    </div>;
}

const styles = {
    memoCard: {
        width: '21em',
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        padding: 0,
    },
    memoTextarea: {
        width: '100%',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        overflow: 'auto',
        resize: 'none',
        //padding: '4px 11px',
        overflowY: 'hidden',
        lineHeight: 1.5,
    },
    style: {
        width: '21em',
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
