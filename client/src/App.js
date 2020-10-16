import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Navbar from './components/layout/Navbar'
import PrivateRoute from './components/routing/PrivateRote'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import Register from './components/auth/Register'
import { loadUser } from './actions/auth'

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<>
					<Navbar />
					<Route exact path='/' component={Landing} />
					<section className='container'>
						<Alert />
						<Switch>
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
						</Switch>
					</section>
				</>
			</Router>
		</Provider>
	)
}

export default App
