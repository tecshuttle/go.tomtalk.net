import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout, Button} from 'antd'
import {fetchMemoCategory} from '../Action'

const {Header, Content, Footer} = Layout;

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

class Category extends Component {
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

                    <ul>
                        <li><Link to={`${this.props.match.url}/new`}>Rendering with React</Link></li>
                        <li><Link to={`${this.props.match.url}/edit`}>Components</Link></li>
                        <li><Link to={`${this.props.match.url}/props-v-state`}>Props v. State</Link></li>
                    </ul>

                    <Route path={`${this.props.match.url}/:topicId`} component={Topic}/>

                    <Route exact path={this.props.match.url} render={() => (
                        <h3>Please select a topic.</h3>
                    )}/>

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

//Category = withRouter(Category);

export default connect(mapStateToProps)(Category)