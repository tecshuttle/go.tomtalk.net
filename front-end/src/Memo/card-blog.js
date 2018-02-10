import React, {Component} from 'react'
import {Icon} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem} from '../Action'

const ReactMarkdown = require('react-markdown');
const CodeBlock = require('./code-block');

export class CardBlog_ extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.blogShow = this.blogShow.bind(this);
    }

    componentWillMount() {
        document.title = 'Memo'
    }

    componentDidUpdate() {
        if (this.props.isotopeInstance !== undefined) {
            this.props.isotopeInstance.arrange();
        }
    }

    onDelete() {
        this.props.dispatch(deleteMemoItem(this.props.item.id));
    }

    blogShow() {
        this.props.history.push('/blog/' + this.props.item.id);
    }

    onEdit() {
        this.props.history.push('/blog/edit/' + this.props.item.id);
    }

    render() {
        const item = this.props.item;

        return <div style={styles.memoCard} className='memo-card'>
            {isMemoEmpty(item) ? <ToolBar onEdit={this.onEdit} onDelete={this.onDelete}/> :
                <BlogContent memo={item} blogShow={this.blogShow}/>}
        </div>;
    }
}

function isMemoEmpty(memo) {
    return (memo.question === '' && memo.answer === '')
}

//显示blog标题和内容
function BlogContent(props) {
    const item = props.memo;
    const color = (item.color === null ? '#000000' : '#' + item.color);

    //仅显示第一段。
    let firstParagraph = props.memo.answer.slice(0, props.memo.answer.indexOf('\n'));

    return <div style={{padding: '1.2em 1.2em 0 1.2em', color: color, cursor: 'pointer'}}
                onClick={() => props.blogShow(item.id)}>
        {item.question === '' ? null : <div style={styles.question}>{item.question}</div>}
        <ReactMarkdown className='memo' renderers={{code: CodeBlock}} source={firstParagraph}/>
    </div>
}

//内容为空时仅toolbar
function ToolBar(props) {
    return <div className='tool-bar' style={styles.emptyToolBar}>
        <span>blog</span>
        <Icon type="edit" onClick={props.onEdit} style={styles.icon}/>
        <Icon type="delete" style={{...styles.icon, color: '#e2534f'}} onClick={props.onDelete}/>
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
    question: {
        fontWeight: 'bold',
        fontSize: '1.2em',
        paddingBottom: '0.5em',
        pointerEevents: 'none'
    }
};

export const CardBlog = connect()(CardBlog_);
