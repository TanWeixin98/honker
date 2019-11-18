import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRetweet} from '@fortawesome/free-solid-svg-icons'
import {Button} from "react-bootstrap"

class RehonkButton extends Component {

    state = {
        timesRetweeted: 0
    }

    static getDerivedStateFromProps(nextProps){
        return { timesRetweeted: nextProps.timesRetweeted }
    }

    render() {
        const space = this.state.timesRetweeted ? <>&nbsp;&nbsp;</> : '';
        console.log(this.state.timesRetweeted, space)
        return (
            <>
                <FontAwesomeIcon icon={faRetweet} color={'grey'}/>
                <strong color={'grey'}>
                    {space}
                    {this.state.timesRetweeted ? this.state.timesRetweeted : ''}
                </strong>
            </>
        );
    }
}

export default RehonkButton;