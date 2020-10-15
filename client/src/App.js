import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Alert from './components/layout/Alert'
import Landing from './components/layout/Landing'
import Login from './auth/Login'
import Navbar from './components/layout/Navbar'
import Register from './auth/Register'

// Redux
import { Provider } from 'react-redux'
import store from './store'

const App = () => (
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
					</Switch>
				</section>
			</>
		</Router>
	</Provider>
)

export default App
