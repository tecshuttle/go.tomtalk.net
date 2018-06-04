import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Layout} from 'antd'
import {checkLogin} from '../Action'

const {Header, Content, Footer} = Layout;
const styles = {
    link: {
        marginRight: 50
    }
};

class Home_ extends Component {
    constructor(props) {
        super(props);

        if (this.props.user.uid === 0) {
            this.props.dispatch(checkLogin());
        }
    }

    componentWillMount() {
        document.title = 'TomTalk'
    }

    render() {
        let {user} = this.props;

        return (<Layout>
            <Header>
                <Link to="/memo" style={styles.link}>Memo</Link>
                <Link to="/todo" style={styles.link}>Todo</Link>

                {user.uid === 0 ?
                    <Link to="/login">Login</Link>
                    :
                    <a href="/api/user/logout">Logout {user.email}</a>
                }
            </Header>
            <Content>Home</Content>
            <Footer>Footer</Footer>
        </Layout>)
    }
}

function mapStateToProps(state, ownProps) {
    return {
        user: state.user,
    }
}

export const Home = connect(mapStateToProps)(Home_);