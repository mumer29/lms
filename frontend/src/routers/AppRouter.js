import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';
import Footer from '../components/Footer/Footer';
/*TOASTIFY*/
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AppRouter = ({ theme, toggleTheme }) => {
	return (
		<Router>
			<ToastContainer position="top-center" />
			<Navbar theme={theme} toggleTheme={toggleTheme} />
			<Switch>
				<Route exact path="/login" component={LoginPage} />
				<Route exact path="/signin">
					<Redirect to="/login" />
				</Route>
				<Route exact path="/register" component={RegisterPage} />
				<Route
					exact
					path="/profile/:username"
					component={ProfilePage}
				/>
				<PrivateRoute
					exact
					path="/dashboard"
					component={DashboardPage}
				/>
				<Route exact path="/" component={HomePage} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
			{/* <Footer /> */}
		</Router>
	);
};

export default AppRouter;
