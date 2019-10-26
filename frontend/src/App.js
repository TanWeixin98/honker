import React from 'react'
import './css/App.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

import NavBar from './components/Navbar'
import UserAuth from './components/UserAuth'

function App() {
    return (
            <div>

                <Router>
                    <NavBar/>
                    <Switch>
                        <Route path='/login'> <UserAuth/> </Route>
                    </Switch>
                </Router>
            </div>
    );
}

export default App
