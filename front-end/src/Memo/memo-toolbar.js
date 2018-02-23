import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Select, Button, Input, Icon, notification} from 'antd';
import {fetchMemoListIfNeeded, fetchMemoCategory, createMemoItem} from '../Action'
import Isotope from 'isotope-layout'

//const imagesLoaded = require('imagesloaded');
const Option = Select.Option;
const Search = Input.Search;

class MemoList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.memoListFilter.keyword,
        };
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(fetchMemoCategory())
    }

    componentDidMount() {
        if (this.isotopeInstance === undefined) {
            this.isotopeInstance = new Isotope(this.getList(), {transitionDuration: 0});
        }
    }

    getList() {
        return document.querySelector('#memo-list')
    }

    onActiveClick() {
        this.props.dispatch(fetchMemoListIfNeeded(this, {category: '', keyword: ''}));
    }

    onChangeCategory(category) {
        this.props.dispatch(fetchMemoListIfNeeded(this, {category: category, keyword: this.props.memoListFilter.keyword}));
    }

    onSearch(keyword) {
        this.setState({keyword: keyword});

        if (keyword === '') {
            notification.open({
                message: '空值不能搜索！'
            });
        }

        this.props.dispatch(fetchMemoListIfNeeded(this, {category: this.props.memoListFilter.category, keyword: keyword}));
    }

    //响应搜索框清空按钮事件
    emitEmpty = () => {
        this.setState({keyword: ''});
        this.props.dispatch(fetchMemoListIfNeeded(this, {category: this.props.memoListFilter.category, keyword: ''}));
        this.keywordInput.focus();
    };

    onChangeKeyword = (e) => {
        this.setState({keyword: e.target.value});
    };

    onNew() {
        this.props.dispatch(createMemoItem(this));
    }

    render() {
        const {keyword} = this.state;
        const suffix = keyword ? <Icon type="close-circle" key='keyword' onClick={this.emitEmpty}/> : null;

        return (

            <div style={{margin: 10}}>
                <Button onClick={this.onNew.bind(this)} type='primary' style={{marginRight: 10}}>新建</Button>
                <Button onClick={this.onActiveClick.bind(this)}>活动条目</Button>

                <Select style={{width: 200, marginLeft: 10, marginRight: 10}} placeholder='请选择分类'
                        onChange={this.onChangeCategory.bind(this)} value={this.props.memoListFilter.category}>
                    <Option value="" key='cat-00'>全部分类</Option>
                    {
                        this.props.memoCategoryList.items.map((item, idx) => (
                            <Option value={item.type} key={'cat-' + idx}>
                                {item.type + ' ' + (item.count === null ? 0 : item.count)}
                            </Option>
                        ))
                    }
                </Select>

                <Search
                    style={{width: 200}} placeholder="请输入搜索关键字"
                    onSearch={this.onSearch.bind(this)} enterButton value={keyword}
                    suffix={suffix} onChange={this.onChangeKeyword}
                    ref={node => this.keywordInput = node}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        memoListFilter: state.memoListFilter,
        memoCategoryList: state.memoCategoryList,
    }
};

export const MemoToolbar = connect(mapStateToProps)(MemoList_);
