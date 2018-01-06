import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Layout, Button, Card} from 'antd'
import {fetchMemoCategory} from '../Action'

const {Content} = Layout;

class CategoryList_ extends Component {
    componentWillMount() {
        this.props.dispatch(fetchMemoCategory())
    }

    onNew() {
        this.props.dispatch({type: 'CLEAR_CATEGORY_ITEM'});
        this.props.history.push(this.props.match.url + '/new');
    }

    onEdit(type_id) {
        this.props.history.push(this.props.match.url + '/edit/' + type_id);
    }

    render() {
        const me = this;

        return (
            <Content>
                <div style={{margin: 10}}>
                    <Button onClick={this.onNew.bind(me)}>新增</Button>
                </div>
                <div style={{margin: 10}}>

                    {
                        this.props.categoryList.items.map((item, idx) => {
                            const editBtn = <Button onClick={() => me.onEdit(item.type_id)}>编辑</Button>;
                            const delBtn = (item.count === '0' ? <Button>删除</Button> : '');

                            return (

                                <Card title={item.type} key={'cat-' + idx}
                                      extra={<div>{editBtn} {delBtn}</div>}
                                      style={{
                                          display: 'inline-block',
                                          marginBottom: 10,
                                          marginRight: 10,
                                          width: 300,
                                          color: '#' + item.color
                                      }}>
                                    <p>等级：{item.priority}</p>
                                </Card>
                            )
                        })
                    }
                </div>
            </Content>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        categoryList: state.categoryList
    }
}

export const CategoryList = connect(mapStateToProps)(CategoryList_);
