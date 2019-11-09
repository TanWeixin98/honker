import React from 'react'
import './css/App.css'
import './popup.css'
import './tweet.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

import NavBar from './components/Navbar'
import UserAuth from './components/UserAuth'
import Verify from './components/Verify'
import Post from './components/Post'
import SearchPopup from './components/SearchPopup'
import Tweets from './components/Tweets'
import ById from './components/ById'
import UserProfile from './components/UserProfile'

function App() {
    return (
            <div>
                <Router>
                    <NavBar/>
                    <Switch>
                        <Route path='/login' component={UserAuth}/>
                        <Route path='/verify' component={Verify}/>
                        <Route path='/post' component={Post}/>
                        <Route path='/search' component={SearchPopup}/>
                        <Route path='/tweets' component={Tweets}/>
                        <Route path='/byid' component={ById}/>
                        <Route exact path='/:username' render={props => <UserProfile {...props}/>}/>
                    </Switch>
                </Router>
            </div>
    );
}

export default App
