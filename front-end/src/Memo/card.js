import React, {Component} from 'react'
import {Icon, Card} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, updateMemoItem} from '../Action'

const {Meta} = Card;
const ReactMarkdown = require('react-markdown');

export class CardM_ extends Component {
    componentWillMount() {
    }

    onDelete(id) {
        this.props.dispatch(deleteMemoItem(id));
    }

    setModule(module) {
        this.props.item.module = module;
        this.props.dispatch(updateMemoItem(this.props.item));
    }

    emptyCard(item) {
        return <Card style={styles.style} bodyStyle={styles.bodyStyle}>
            <Icon type="tag-o" onClick={() => this.setModule('memo')} style={styles.emptyCardIcon}/>
            <Icon type="file-text" onClick={() => this.setModule('blog')} style={styles.emptyCardIcon}/>
            <Icon type="camera-o" onClick={() => this.setModule('photo')} style={styles.emptyCardIcon}/>
            <Icon type="delete" onClick={() => this.onDelete(item.id)} style={{...styles.emptyCardIcon, color: 'red', float: 'right'}}/>
        </Card>;
    }

    photoCard(item) {
        return <Card style={styles.style}
                     cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}>
            <Meta title="Europe Street beat" description="www.instagram.com"/>
        </Card>;
    }

    blogCard(item) {
        const delBtn = (item.question === '' && item.answer === '' ? <Icon type="delete" onClick={() => this.onDelete(item.id)}/> : '');
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;

        return <Card style={{...styles.style, color: '#' + item.color}}
                     title={<span style={{color: '#' + item.color}}><Icon type='file-text'/>{item.type} 字数：{item.answer.length}</span>}
                     extra={<div>{delBtn}{editBtn}</div>}>
            <h2>{item.question}</h2>
        </Card>;
    }

    memoCard(item) {
        const delBtn = (item.question === '' && item.answer === '' ? <Icon type="delete" onClick={() => this.onDelete(item.id)}/> : '');
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;

        return <Card style={{...styles.style, color: '#' + item.color}}
                     title={<span style={{color: '#' + item.color}}><Icon type='tag'/>{item.type + ' ' + item.question}</span>}
                     extra={<div>{delBtn}{editBtn}</div>}>
            <ReactMarkdown style={{color: '#' + item.color}} source={item.answer}/>
        </Card>;
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

export const CardM = connect()(CardM_);
