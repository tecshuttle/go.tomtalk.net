import React, {Component} from 'react'
import {Icon, Card} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem} from '../Action'

const ReactMarkdown = require('react-markdown');

export class CardM_ extends Component {
    componentWillMount() {
    }

    onDelete(id) {
        this.props.dispatch(deleteMemoItem(id));
    }

    emptyCard(item) {
        return <Card style={styles.style} bodyStyle={styles.bodyStyle}>
            <Icon type="tag-o" style={{fontSize: 30, marginLeft: 10}}/>
            <Icon type="file-text" style={{fontSize: 30, marginLeft: 10}}/>
            <Icon type="camera-o" style={{fontSize: 30, marginLeft: 10}}/>
            <Icon type="delete" onClick={() => this.onDelete(item.id)} style={{fontSize: 30, float: 'right'}}/>
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

    render() {
        const item = this.props.item;
        return this.props.type === 'empty' ? this.emptyCard(item) : this.memoCard(item);
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
    }
};

export const CardM = connect()(CardM_);
