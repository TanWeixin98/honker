import React from 'react'
import './css/App.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

import NavBar from './components/Navbar'
import UserAuth from './components/UserAuth'
import Verify from './components/Verify'
import PostItem from './components/PostItem'
import Tweets from './components/Tweets'
import ById from './components/ById'
import UserProfile from './components/UserProfile'
import HomePage from './components/HomePage'
import PostList from './components/PostList'

function App() {
    return (
            <div>
                <Router>
                    <NavBar/>
                    <Switch>
                        <Route exact path='/' component={HomePage}/>
                        <Route path='/login' render={props => <UserAuth {...props} isRegister={false}/>}/>
                        <Route path='/adduser' render={props => <UserAuth {...props} isRegister={true}/>}/>
                        <Route path='/verify' component={Verify}/>
                        <Route path='/post' component={PostItem}/>
                        <Route path='/tweets' component={Tweets}/>
                        <Route path='/search' component={PostList}/>
                        <Route path='/byid' component={ById}/>
                        <Route path='/:username/:view?' render={props => <UserProfile {...props}/>}/>
                    </Switch>
                </Router>
            </div>
    );
}

export default App
