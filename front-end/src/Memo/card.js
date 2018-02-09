import React, {Component} from 'react'
import {Icon, Form, Card, Select, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'
import Textarea from 'react-textarea-autosize'

const {Meta} = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const ReactMarkdown = require('react-markdown');
const CodeBlock = require('./code-block');

export class CardM_ extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
        };

        this.onEdit = this.onEdit.bind(this);
    }

    componentWillMount() {
        document.title = 'Memo'
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
            <Icon type="delete" style={{fontSize: 22, cursor: 'pointer'}} onClick={() => this.onDelete(item.id)}/> : '');
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{fontSize: 22, cursor: 'pointer'}}/>;
        const color = (item.color === null ? '#000000' : '#' + item.color);

        let inboxBtn = <Icon type="inbox"
                             onClick={() => this.onInBox(item.id)}
                             style={{fontSize: 22, cursor: 'pointer'}}/>;

        return <div style={{...styles.memoCard, color: color}}
                    className='memo-card'>
            <BlogContent memo={item} openClick={this.props.blogShow}/>
            <ToolBar state={this.state} memo={item} inbox={inboxBtn} edit={editBtn} del={delBtn}/>
        </div>;
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

        const saveBtn = <Icon type="save" onClick={this.handleSubmit} style={{fontSize: 22, cursor: 'pointer'}}/>;
        let inboxBtn = <Icon type="inbox"
                             onClick={() => this.onInBox(item.id)}
                             style={{fontSize: 22, cursor: 'pointer'}}/>;
        const upBtn = <Icon type="up" onClick={() => this.up()} style={{fontSize: 22, cursor: 'pointer'}}/>;

        if (this.state.isEdit) {
            return <div style={{...styles.memoCard, color: color}} className='memo-card'>
                <ToolBarEdit save={saveBtn} up={upBtn} inbox={inboxBtn}/>
                <Form onSubmit={this.handleSubmit} style={{margin: 0, padding: '0.6em 0.8em 0.5em 0.8em'}}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator('type_id', {
                            initialValue: item.type_id
                        })(
                            <Select style={{width: '100%'}} placeholder='请选择分类' className='memo'>
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
                                      className='memo'
                                      style={{...styles.memoTextarea, fontSize: '1.2em', fontWeight: 'bold'}}
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
                                      className='memo'
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

            return <div style={{...styles.memoCard, color: color, cursor: 'pointer'}}
                        className='memo-card'
                        onClick={this.onEdit}>
                <MemoContent memo={item}/>
                <ToolBar state={this.state} memo={item} edit={editBtn} del={delBtn} inbox={inboxBtn}/>
            </div>;
        }
    }

    emptyCard(item) {
        return <div style={{...styles.memoCard}}
                    className='memo-card'>
            <p>empty memo</p>
            <div className='module-tool-bar' style={{
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
                <Icon type="tag-o" onClick={() => this.setModule('memo')} style={{fontSize: 22, cursor: 'pointer'}}/>
                <Icon type="file-text" onClick={() => this.setModule('blog')} style={{fontSize: 22, cursor: 'pointer'}}/>
                <Icon type="camera-o" onClick={() => this.setModule('photo')} style={{fontSize: 22, cursor: 'pointer'}}/>
                <Icon type="delete" onClick={() => this.onDelete(item.id)} style={{fontSize: 22, color: '#e2534f', cursor: 'pointer'}}/>
            </div>
        </div>;
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

//显示memo标题和内容
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

    return <div style={{padding: '1.2em 1.2em 0 1.2em'}}>
        {question}
        <ReactMarkdown style={{color: color}}
                       renderers={{code: CodeBlock}}
                       className='memo'
                       source={props.memo.answer}/>
    </div>
}

//显示blog标题和内容
function BlogContent(props) {
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

    //仅显示第一段。
    let firstParagraph = props.memo.answer.slice(0, props.memo.answer.indexOf('\n'));

    return <div style={{padding: '1.2em 1.2em 0 1.2em', cursor: 'pointer'}} onClick={() => props.openClick(props.memo.id)}>
        {question}
        <ReactMarkdown style={{color: color}}
                       renderers={{code: CodeBlock}}
                       className='memo'
                       source={firstParagraph}/>
    </div>
}

function ToolBar(props) {
    const toolbar = <div className='tool-bar' style={{
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
        <span>{props.memo.module}</span>
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
        marginRight: '1em',
        marginBottom: '1em',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        padding: 0,
    },
    memoTextarea: {
        width: '100%',
        border: 0,
        borderRadius: '4px',
        overflow: 'auto',
        resize: 'none',
        overflowY: 'hidden',
        lineHeight: 1.5,
        fontWeight: 300,
    },
    style: {
        width: '21em',
        marginRight: '1em',
        marginBottom: '1em'
    },
    bodyStyle: {
        color: '#333333',
        padding: 5
    }
};

function mapStateToProps(state) {
    return {
        memoCategoryList: state.memoCategoryList,
    }
}

const CardM__ = connect(mapStateToProps)(CardM_);

const CardForm = Form.create()(CardM__);

export const CardM = connect()(CardForm);
