import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import Register from './auth/Register'
import Login from './auth/Login'

const App = () => {
	return (
		<Router>
			<>
				<Navbar />
				<Route exact path='/' component={Landing} />
				<section className='container'>
					<Switch>
						<Route exact path='/register' component={Register} />
						<Route exact path='/login' component={Login} />
					</Switch>
				</section>
			</>
		</Router>
	)
}

export default App
