import React, {Component} from 'react'
import {Icon, Card, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, inBoxMemoItem, updateMemoItem} from '../Action'

const {Meta} = Card;
const ReactMarkdown = require('react-markdown');

export class CardM_ extends Component {
    componentWillMount() {
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

    emptyCard(item) {
        return <Card style={styles.style} bodyStyle={styles.bodyStyle}>
            <Icon type="tag-o" onClick={() => this.setModule('memo')} style={styles.emptyCardIcon}/>
            <Icon type="file-text" onClick={() => this.setModule('blog')} style={styles.emptyCardIcon}/>
            <Icon type="camera-o" onClick={() => this.setModule('photo')} style={styles.emptyCardIcon}/>
            <Icon type="delete" onClick={() => this.onDelete(item.id)} style={{...styles.emptyCardIcon, color: 'red', float: 'right'}}/>
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
        const delBtn = (item.question === '' && item.answer === '' ? <Icon type="delete" onClick={() => this.onDelete(item.id)}/> : '');
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;
        const color = (item.color === null ? '#000000' : '#' + item.color);

        return <Card style={{...styles.style, color: color}}
                     title={<span style={{color: color}}><Icon type='file-text'/>{item.type} 字数：{item.answer.length}</span>}
                     extra={<div>{delBtn}{editBtn}</div>}>
            <h2 style={{cursor: 'pointer'}} onClick={() => this.props.blogShow(item.id)}>{item.question}</h2>
        </Card>;
    }

    memoCard(item) {
        const color = (item.color === null ? '#000000' : '#' + item.color);
        const delBtn = (item.question === '' && item.answer === '' ?
                <Icon type="delete" style={{marginRight: 10}} onClick={() => this.onDelete(item.id)}/>
                : ''
        );
        const editBtn = <Icon type="edit" onClick={() => this.props.onEdit(item.id)} style={{marginLeft: 10}}/>;
        const title = <span style={{color: color}}>
            <Icon type='tag'/>
            {item.type === null ? "" : ' ' + item.type + ' '} {item.question}
            </span>;

        return <Card style={{...styles.style, color: color}}
                     title={title}
                     extra={<div>{delBtn}<Icon type="inbox" onClick={() => this.onInBox(item.id)}/>{editBtn}</div>}>
            <ReactMarkdown style={{color: color}} source={item.answer}/>
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
