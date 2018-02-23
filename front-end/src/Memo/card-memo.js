import React, {Component} from 'react'
import {Icon, Form, Select} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'
import Textarea from 'react-textarea-autosize'

const FormItem = Form.Item;
const Option = Select.Option;
const ReactMarkdown = require('react-markdown');
const CodeBlock = require('./code-block');

export class CardM_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //item: props.item,
            isEdit: false,
            isHide: false, //归纳或删除直接影响，不再删除memoList，避免render整个列表。
            shouldArrange: false,
        };
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onInBox = this.onInBox.bind(this);
        this.onUp = this.onUp.bind(this);
    }

    componentWillMount() {
        document.title = 'Memo'
    }

    // 编辑内容时，能根据文本框高度的变化而重排布局。
    componentDidUpdate(prevProps, prevState) {
        if (this.props.parent.isotopeInstance !== undefined && this.state.shouldArrange) {
            this.props.parent.isotopeInstance.arrange();
        }
    }

    onDelete() {
        this.setState({isHide: true, shouldArrange: true});
        this.props.dispatch(deleteMemoItem(this.props.parent, this.props.item.id));
    }

    onInBox() {
        this.setState({isHide: true, shouldArrange: true});
        this.props.dispatch(inBoxMemoItem(this.props.item.id));
    }

    onEdit() {
        this.setState({isEdit: true, shouldArrange: false});
    }

    onUp() {
        this.setState({isEdit: false, shouldArrange: true});
    }

    onSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({item: {...this.props.item, ...values}});
                this.props.dispatch(updateMemoItem({...this.props.item, ...values}));
            } else {
                console.log(err);
            }

            this.onUp()
        });
    };

    editView() {
        const item = this.props.item;
        const {getFieldDecorator} = this.props.form;
        const color = (item.color === null ? '#000000' : '#' + item.color);

        return <div style={{...styles.memoCard, color: color}} className='memo-card'>
            <ToolBarEdit onUp={this.onUp} onInBox={this.onInBox} onSave={this.onSave}/>
            <Form onSubmit={this.onSave} style={{margin: 0, padding: '0.6em 0.8em 0.5em 0.8em'}}>
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
                                      this.props.parent.isotopeInstance.arrange();
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
                                      this.props.parent.isotopeInstance.arrange();
                                  }}
                        />
                    )}
                </div>
            </Form>
        </div>;
    }

    showView() {
        const item = this.props.item;
        //console.log('memo', item);

        return <div style={styles.memoCard} className='memo-card' onClick={this.onEdit}>
            {isMemoEmpty(item) ? <ToolBar onEdit={this.onEdit} onDelete={this.onDelete}/> : <MemoContent memo={item}/>}
        </div>;
    }

    render() {
        if (this.state.isHide) {
            return null;
        } else if (this.state.isEdit) {
            return this.editView()
        } else {
            return this.showView()
        }
    }
}

function isMemoEmpty(memo) {
    return (memo.question === '' && memo.answer === '')
}

//显示memo标题和内容
function MemoContent(props) {
    const item = props.memo;
    const color = (item.color === null ? '#000000' : '#' + item.color);

    return <div style={{padding: '1.2em 1.2em 0 1.2em', color: color, cursor: 'pointer'}}>
        {item.question === '' ? null : <div style={styles.question}>{item.question}</div>}
        <ReactMarkdown className='memo' renderers={{code: CodeBlock}} source={item.answer}/>
    </div>
}

//内容为空时仅toolbar
function ToolBar(props) {
    return <div className='tool-bar' style={styles.emptyToolBar}>
        <span>memo</span>
        <Icon type="edit" onClick={props.onEdit} style={styles.icon}/>
        <Icon type="delete" style={{...styles.icon, color: '#e2534f'}} onClick={props.onDelete}/>
    </div>;
}

function ToolBarEdit(props) {
    return <div className='tool-bar' style={styles.editToolBar}>
        <Icon type="up" onClick={props.onUp} style={styles.icon}/>
        <Icon type="inbox" onClick={props.onInBox} style={styles.icon}/>
        <Icon type="save" onClick={props.onSave} style={styles.icon}/>
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
    icon: {
        fontSize: 22,
        cursor: 'pointer',
    },
    emptyToolBar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '.6em 1.2em',
    },
    editToolBar: {
        backgroundColor: '#ffffff',
        width: '100%',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0.5em 1em',
    },
    question: {
        fontWeight: 'bold',
        fontSize: '1.2em',
        paddingBottom: '0.5em',
        pointerEevents: 'none'
    }
};

function mapStateToProps(state) {
    return {
        memoCategoryList: state.memoCategoryList,
    }
}

const CardM__ = connect(mapStateToProps)(CardM_);

export const CardMemo = Form.create()(CardM__);
