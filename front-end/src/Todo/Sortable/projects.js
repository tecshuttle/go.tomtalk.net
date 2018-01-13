import React, {Component} from 'react'
import Container from './Container'

export class Projects extends Component {
    render() {
        return (
            <div>
                <Container day={1}/>
                <hr/>
                <Container day={2}/>
            </div>
        )
    }
}