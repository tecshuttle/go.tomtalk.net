import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Select, Button, Input, Icon, notification, Card} from 'antd';
import {fetchPostsIfNeeded, fetchMemoCategory} from '../Action'

const {Content} = Layout;
const Option = Select.Option;
const Search = Input.Search;

class MemoList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
        };
    }

    componentWillMount() {
        const {dispatch, selectedSubreddit} = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit, ''));
        dispatch(fetchMemoCategory())
    }

    onClick(category) {
        this.props.dispatch(fetchPostsIfNeeded(category, ''));
    }

    onActiveClick() {
        this.props.dispatch(fetchPostsIfNeeded('active', ''));
    }

    onSearch(keyword) {
        if (keyword === '') {
            notification.open({
                message: '空值不能搜索！'
            });
        } else {
            this.props.dispatch(fetchPostsIfNeeded('search', keyword));
        }
    }

    emitEmpty = () => {
        this.keywordInput.focus();
        this.setState({keyword: ''});
    };

    onChangeUserName = (e) => {
        this.setState({keyword: e.target.value});
    };

    onCardClick(id) {
        this.props.history.push(this.props.match.url + '/edit/' + id);
    }

    render() {
        const {keyword} = this.state;
        const me = this;
        const suffix = keyword ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return (
            <Content>
                <div style={{margin: 10}}>
                    <Button onClick={this.onActiveClick.bind(this)}>活动条目</Button>

                    <Select style={{width: 200, marginLeft: 10, marginRight: 10}} placeholder='请选择分类'
                            onChange={this.onClick.bind(this)}>
                        {
                            this.props.categoryList.items.map((item, idx) => (
                                <Option value={item.type}
                                        key={'cat-' + idx}>{item.type + ' ' + item.count}</Option>
                            ))
                        }
                    </Select>

                    <Search
                        style={{width: 200}} placeholder="请输入搜索关键字"
                        onSearch={this.onSearch.bind(this)} enterButton value={keyword}
                        suffix={suffix} onChange={this.onChangeUserName}
                        ref={node => this.keywordInput = node}
                    />
                </div>

                <div style={{margin: 10}}>
                    {this.props.memoList.items.map((item, idx) => (
                        <Card title={item.question}
                              extra={<Icon type="edit" onClick={() => me.onCardClick(item.id)}/>}
                              style={{width: 300, display: 'inline-block', marginRight: 10, marginBottom: 10}}
                              key={'item-' + idx}>
                            {item.answer}
                        </Card>
                    ))}
                </div>
            </Content>
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

export const MemoList = connect(mapStateToProps)(MemoList_);
