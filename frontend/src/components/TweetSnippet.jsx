import React, {Component} from 'react'
import {Card} from "react-bootstrap"
import '../css/TweetSnippet.css'

class TweetSnippet extends Component {

    render() {
        return (
            <Card bg="light">
                <Card.Title>{this.props.username}</Card.Title>
                <Card.Subtitle className="snippetTime">{this.props.time}</Card.Subtitle>
                <Card.Text>{this.props.content}</Card.Text>
            </Card>
        );
    }
}

export default TweetSnippet;