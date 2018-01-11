import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import {Layout} from 'antd'
import {TodoList} from './todolist'

const {Header, Footer} = Layout;
const styles = {
    link: {
        marginRight: 50
    }
};

const Projects = () => ( <div><h2>Projects</h2></div> );
const monthAnalyze = () => ( <div><h2>month Analyze</h2></div> );
const weekAnalyze = () => ( <div><h2>week Analyze</h2></div> );
const weekReport = () => ( <div><h2>week Report</h2></div> );
const exportData = () => ( <div><h2>export Data</h2></div> );

export default class Todo extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/" style={styles.link}>首页</Link>
                    <Link to={`${this.props.match.url}`} style={styles.link}>Todo</Link>
                    <Link to={`${this.props.match.url}/projects`} style={styles.link}>项目列表</Link>
                    <Link to={`${this.props.match.url}/month-analyze`} style={styles.link}>月统计</Link>
                    <Link to={`${this.props.match.url}/week-analyze`} style={styles.link}>周统计</Link>
                    <Link to={`${this.props.match.url}/week-report`} style={styles.link}>周报</Link>
                    <Link to={`${this.props.match.url}/export-data`} style={styles.link}>数据导出</Link>
                </Header>

                <Route exact path={this.props.match.url} component={TodoList}/>
                <Route exact path={`${this.props.match.url}/projects`} component={Projects}/>
                <Route exact path={`${this.props.match.url}/month-analyze`} component={monthAnalyze}/>
                <Route exact path={`${this.props.match.url}/week-analyze`} component={weekAnalyze}/>
                <Route exact path={`${this.props.match.url}/week-report`} component={weekReport}/>
                <Route exact path={`${this.props.match.url}/export-data`} component={exportData}/>

                <Footer> Footer </Footer>
            </Layout>
        )
    }
}
