import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Alert from './components/layout/Alert'
import CreateProfile from './components/profile-forms/CreateProfile'
import Dashboard from './components/dashboard/Dashboard'
import EditProfile from './components/profile-forms/EditProfile'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Navbar from './components/layout/Navbar'
import Profile from './components/profile/Profile'
import Profiles from './components/profiles/Profiles'
import PrivateRoute from './components/routing/PrivateRote'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import Register from './components/auth/Register'
import { loadUser } from './actions/auth'
import AddExperience from './components/profile-forms/AddExperience'
import AddEducation from './components/profile-forms/AddEducation'

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
							<Route exact path='/profiles' component={Profiles} />
							<Route exact path='/profile/:id' component={Profile} />
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
							<PrivateRoute
								exact
								path='/create-profile'
								component={CreateProfile}
							/>
							<PrivateRoute
								exact
								path='/edit-profile'
								component={EditProfile}
							/>
							<PrivateRoute
								exact
								path='/add-experience'
								component={AddExperience}
							/>
							<PrivateRoute
								exact
								path='/add-education'
								component={AddEducation}
							/>
						</Switch>
					</section>
				</>
			</Router>
		</Provider>
	)
}

export default App
