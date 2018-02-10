import React, {Component} from 'react'
import {Icon, Card, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem} from '../Action'

const {Meta} = Card;

class CardPhoto_ extends Component {
    componentWillMount() {
        document.title = 'Memo'
    }

    onDelete(id) {
        this.props.dispatch(deleteMemoItem(id));
    }

    render() {
        const confirm = <Popconfirm title="真要删除图片吗？"
                                    onConfirm={() => this.onDelete(this.props.item.id)}
                                    okText="坚决删除"
                                    cancelText="还是算了">
            <Icon type="delete"/>
        </Popconfirm>;

        return <Card style={styles.memoCard}
                     cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                     className='memo-card'>
            <Meta title={<div><span>Europe Street beat</span>{confirm}</div>}
                  description="www.instagram.com"/>
        </Card>;
    }
}

const styles = {
    memoCard: {
        width: '21em',
        marginRight: '1em',
        marginBottom: '1em',
        backgroundColor: '#ffffff',
        borderWidth: 0,
        padding: 0,
    },
};

export const CardPhoto = connect()(CardPhoto_);