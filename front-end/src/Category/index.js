import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Button} from 'antd'
import {fetchMemoCategory} from '../Action'

const {Content, Footer, Header} = Layout;

const Topic = ({match}) => (
    <div>
        <Link to="/category">返回</Link>
        <h3>{match.params.topicId} type</h3>
    </div>
);

class CategoryList extends Component {
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
            <div>
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
            </div>
        )
    }
}

const CategoryListA = connect(mapStateToProps)(CategoryList);

export default class Category extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={{marginRight: 50}}>首页</Link>
                    <Link to="/memo">Memo</Link>
                </Header>

                <Content>
                    <Route path={`${this.props.match.url}/:topicId`} component={Topic}/>
                    <Route exact path={this.props.match.url} component={CategoryListA}/>
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


//export default Category