import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Layout, Select, Button} from 'antd';
import {fetchPostsIfNeeded, fetchMemoCategory} from '../Action'

const {Header, Content, Footer} = Layout;
const Option = Select.Option;

class Memo extends Component {

    componentWillMount() {
        const {dispatch, selectedSubreddit} = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
        dispatch(fetchMemoCategory())
    }

    onClick(category) {
        this.props.dispatch(fetchPostsIfNeeded(category));
    }

    onActiveClick() {
        this.props.dispatch(fetchPostsIfNeeded('active'));
    }

    render() {
        return (

            <Layout>
                <Header><Link to="/">Home</Link></Header>
                <Layout>
                    <Content>
                        <Button onClick={this.onActiveClick.bind(this)}>活动条目</Button>

                        <Select style={{width: 200}} placeholder='请选择分类' onChange={this.onClick.bind(this)}>
                            {
                                this.props.categoryList.items.map((item, idx) => (
                                    <Option value={item.type} key={'cat-' + idx}>{item.type + ' ' + item.count}</Option>
                                ))
                            }
                        </Select>

                        {this.props.memoList.items.map((item, idx) => (
                            <div key={'item' + idx}>
                                <h1>{item.question}</h1>
                                <p>{item.answer}</p>
                            </div>
                        ))}
                    </Content>

                </Layout>
                <Footer>footer</Footer>
            </Layout>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        memoList: state.memoList,
        categoryList: state.categoryList,
        selectedSubreddit: state.selectedSubreddit
    }
};

export default connect(mapStateToProps)(Memo);
