import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Layout} from 'antd'

const {Header, Content, Footer} = Layout;
const styles = {
    link: {
        marginRight: 50

    }
};

export default class Home extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <Link to="/memo" style={styles.link}>Memo</Link>
                    <Link to="/todo">Todo</Link>
                </Header>
                <Content>Home</Content>
                <Footer>Footer</Footer>
            </Layout>

        )
    }
}



