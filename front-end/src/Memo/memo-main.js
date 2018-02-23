import React, {Component} from 'react'
import {Layout} from 'antd';
import {MemoToolbar} from './memo-toolbar'
import {MemoList} from './memo-list'

const {Content} = Layout;

export class MemoMain extends Component {

    render() {
        return (
            <Content>
                <MemoToolbar/>
                <MemoList history={this.props.history}/>
            </Content>
        )
    }
}
