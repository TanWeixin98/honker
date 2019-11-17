import React, {Component} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {Button} from "react-bootstrap"
import {withRouter} from "react-router-dom"
import "../css/Likes.css"
import API from "../constants"

const activeColor = "#b3320e"
const unactiveColor = "grey"

class Likes extends Component {

    state = {
        id: null,
        numLikes: 0,
        liked: false
    }

    constructor(props) {
        super(props)
        this.state.id = props.id
        this.state.numLikes = props.likes
    }

    render() {
        return (
            <Button variant="outline-*" onClick={this.handleClick}>
                <FontAwesomeIcon icon={faHeart} color={this.state.liked ? activeColor : unactiveColor}/>
                &nbsp;&nbsp;
                <strong
                    style={{color: this.state.liked ? activeColor : unactiveColor}}>{this.state.numLikes ? this.state.numLikes : ''}</strong>
            </Button>
        );
    }

    handleClick = () => {
        this.setState(prevState => ({
                numLikes: prevState.liked ? prevState.numLikes - 1 : prevState.numLikes + 1,
                liked: !prevState.liked
            }),
            () => {
                const url = API + `/item/${this.state.id}/like`
                var payload = {like: this.state.liked}

                fetch(url, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(response => {
                        if (response.error && response.error.includes('log'))
                            this.props.history.push('/login')
                    })
                    .catch(err => {
                        this.setState(prevState =>
                            ({
                                numLikes: prevState.liked ? prevState.numLikes - 1 : prevState.numLikes + 1,
                                liked: !prevState.liked
                            })
                        )
                    })
            }
        )

    }

}

export default withRouter(Likes);