import React, {Component} from 'react'
import {Icon} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem, updateMemoItem} from '../Action'

class CardNew_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            isHide: false, //归纳或删除直接影响，不再删除memoList，避免render整个列表。
        };
    }

    componentWillMount() {
        document.title = 'Memo'
    }

    setModule(module) {
        this.props.item.module = module;
        this.props.dispatch(updateMemoItem(this.props.item));
    }

    onDelete() {
        this.setState({isHide: true, shouldArrange: true});
        this.props.dispatch(deleteMemoItem(this.props.parent, this.props.item.id));
    }

    render() {
        if (this.state.isHide) {
            return null;
        } else {
            return <div className='module-tool-bar' style={styles.toolBar}>
                <Icon type="tag-o" onClick={() => this.setModule('memo')} style={styles.icon}/>
                <Icon type="file-text" onClick={() => this.setModule('blog')} style={styles.icon}/>
                <Icon type="camera-o" onClick={() => this.setModule('photo')} style={styles.icon}/>
                <Icon type="delete" onClick={() => this.onDelete()} style={{...styles.icon, color: '#e2534f'}}/>
            </div>;
        }
    }
}

const styles = {
    toolBar: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '1em',
        marginRight: '1em',
        justifyContent: 'space-between',
        padding: '0.6em 1.2em',
        width: '21em',
    },
    icon: {
        fontSize: 22,
        cursor: 'pointer'
    }
};

export const CardNew = connect()(CardNew_);