import React, {Component} from 'react'
import {Icon, Card, Popconfirm} from 'antd';
import {connect} from 'react-redux'
import {deleteMemoItem} from '../Action'

const {Meta} = Card;

class CardPhoto_ extends Component {
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

    onDelete() {
        this.setState({isHide: true, shouldArrange: true});
        this.props.dispatch(deleteMemoItem(this.props.parent, this.props.item.id));
    }

    render() {
        const confirm = <Popconfirm title="真要删除图片吗？"
                                    onConfirm={() => this.onDelete()}
                                    okText="坚决删除"
                                    cancelText="还是算了">
            <Icon type="delete"/>
        </Popconfirm>;

        if (this.state.isHide) {
            return null;
        } else {
            return <Card style={styles.memoCard}
                         cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
                         className='memo-card'>
                <Meta title={<div><span>Europe Street beat</span>{confirm}</div>}
                      description="www.instagram.com"/>
            </Card>;
        }
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