import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Select, Button, Input, Icon, notification} from 'antd';
import {fetchMemoListIfNeeded, fetchMemoCategory, createMemoItem} from '../Action'
import {CardM} from './card'
import {CardNew} from './card-new'
import Isotope from 'isotope-layout'

const imagesLoaded = require('imagesloaded');
const {Content} = Layout;
const Option = Select.Option;
const Search = Input.Search;

class MemoList_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.memoListFilter.keyword,
        };

        this.onEdit = this.onEdit.bind(this);
        this.blogShow = this.blogShow.bind(this);
    }

    componentWillMount() {
        const {dispatch, memoListFilter} = this.props;
        dispatch(fetchMemoListIfNeeded({category: memoListFilter.category, keyword: memoListFilter.keyword}));
        dispatch(fetchMemoCategory())
    }

    componentDidMount() {
        if (this.isotopeInstance === undefined) {
            this.isotopeInstance = new Isotope(this.getList(), {transitionDuration: 0})
        }
    }

    componentDidUpdate() {
        this.isotopeInstance.reloadItems();
        this.isotopeInstance.arrange();

        const me = this;
        imagesLoaded(this.getList(), function () {
            me.isotopeInstance.arrange();
        });
    }

    getList() {
        return document.querySelector('#memo-list')
    }

    onActiveClick() {
        //this.setState({keyword: ''});
        this.props.dispatch(fetchMemoListIfNeeded({category: '', keyword: ''}));
    }

    onChangeCategory(category) {
        this.props.dispatch(fetchMemoListIfNeeded({category: category, keyword: this.props.memoListFilter.keyword}));
    }

    onSearch(keyword) {
        this.setState({keyword: keyword});

        if (keyword === '') {
            notification.open({
                message: '空值不能搜索！'
            });
        }

        this.props.dispatch(fetchMemoListIfNeeded({category: this.props.memoListFilter.category, keyword: keyword}));
    }

    //响应搜索框清空按钮事件
    emitEmpty = () => {
        this.setState({keyword: ''});
        this.props.dispatch(fetchMemoListIfNeeded({category: this.props.memoListFilter.category, keyword: ''}));
        this.keywordInput.focus();
    };

    onChangeKeyword = (e) => {
        this.setState({keyword: e.target.value});
    };

    onNew() {
        this.props.dispatch(createMemoItem());
    }

    onEdit(id) {
        this.props.history.push(this.props.match.url + '/edit/' + id);
    }

    blogShow(id) {
        this.props.history.push('/blog/' + id);
    }

    render() {
        const {keyword} = this.state;
        const suffix = keyword ? <Icon type="close-circle" key='keyword' onClick={this.emitEmpty}/> : null;

        return (
            <Content>
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

                <div style={{margin: 10}} id="memo-list">
                    {this.props.memoList.items.map((item, i) => {
                        if (item.module === null) {
                            return (<CardNew item={item} idx={i} key={'memo-' + i}/>)
                        } else {
                            return (<CardM type={item.module} item={item} idx={i} key={'memo-' + i}
                                           isotopeInstance={this.isotopeInstance}
                                           onEdit={this.onEdit} blogShow={this.blogShow}/>)
                        }
                    })}
                </div>
            </Content>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        memoList: state.memoList,
        memoListFilter: state.memoListFilter,
        memoCategoryList: state.memoCategoryList,
    }
};

export const MemoList = connect(mapStateToProps)(MemoList_);
