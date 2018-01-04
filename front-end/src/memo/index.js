import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Layout, Select} from 'antd';
import {fetchPostsIfNeeded} from '../Action'

const {Header, Content, Footer} = Layout;
const Option = Select.Option;

class Memo extends Component {
    componentWillMount() {
        const {dispatch, selectedSubreddit} = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }

    onClick() {
    }

    render() {
        return (

            <Layout>
                <Header><Link to="/">Home</Link></Header>
                <Layout>
                    <Content>
                        main content
                        <button onClick={() => this.onClick()}>New</button>

                        <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.onClick}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>Disabled</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>

                        <h2>memo</h2>
                        <hr/>
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
        selectedSubreddit: state.selectedSubreddit
    }
};

export default connect(mapStateToProps)(Memo);
