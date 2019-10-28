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

function App() {
    return (
            <div>
                <Router>
                    <NavBar/>
                    <Switch>
                        <Route path='/login' component={UserAuth}/>
                        <Route path='/verify' component={Verify}/>
                    </Switch>
                </Router>
            </div>
    );
}

export default App
