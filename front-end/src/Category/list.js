import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Button} from 'antd'
import {fetchMemoCategory} from '../Action'

const {Header, Content, Footer} = Layout;

export class CategoryList extends Component {
    componentWillMount() {
        console.log(this);
        this.props.dispatch(fetchMemoCategory())
    }

    onNew() {
        this.props.history.push(this.props.match.url + '/new');
    }

    onEdit() {
        this.props.history.push(this.props.match.url + '/edit');
    }

    render() {
        const me = this;

        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/memo">Memo</Link>
                </Header>

                <Content>
                    <div style={{margin: 10}}>
                        <Button onClick={this.onNew.bind(me)}>新增</Button>
                    </div>

                    {
                        this.props.categoryList.items.map((item, idx) => {
                            const editBtn = <Button onClick={this.onEdit.bind(me)}>编辑</Button>;
                            const delBtn = (item.count === '0' ? <Button>删除</Button> : '');

                            return (<p key={'cat-' + idx}>
                                {item.color} {item.type} {item.count}
                                {editBtn}
                                {delBtn}
                            </p>)
                        })
                    }
                </Content>

                <Footer>footer</Footer>
            </Layout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        categoryList: state.categoryList
    }
}

connect(mapStateToProps)(CategoryList);
