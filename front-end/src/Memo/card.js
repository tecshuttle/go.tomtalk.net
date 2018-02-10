import React, {Component} from 'react'
import {Icon, Form, Card, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'

const {Meta} = Card;
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

    onSave = (e) => {
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
            <Icon type="delete" style={{fontSize: 22, cursor: 'pointer', color: '#e2534f'}} onClick={() => this.onDelete(item.id)}/> : '');
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
        return this.createCard(this.props.item);
    }
}

function isMemoEmpty(memo) {
    return (memo.question === '' && memo.answer === '')
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
        padding: '0.6em 1.2em',
    }}>
        <span>{props.memo.module}</span>
        {props.edit}
        {props.del}
    </div>;

    //如果内容为空则直接显示工具条。
    if (isMemoEmpty(props.memo)) {
        return toolbar
    } else {
        return null
    }
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
