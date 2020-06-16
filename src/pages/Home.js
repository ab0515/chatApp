import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

import { Typography } from '@material-ui/core';

const Home = () => {
	return (
		<div>
			<NavBar />
			<Typography variant="h5">Welcome</Typography>

			<Typography><Link to="/signup">Create an account</Link></Typography>
			<Typography><Link to="/login">Login to your account</Link></Typography>
		</div>
	);
};

export default Home;