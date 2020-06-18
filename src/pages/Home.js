import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Typography } from '@material-ui/core';

const Home = (props) => {

	return (
		<div>			
			<Typography variant="h5">Welcome</Typography>

			<Typography><Link to="/signup">Create a new account</Link></Typography>
			<Typography><Link to="/login">Login to your account</Link></Typography>
		</div>
	);
};

export default Home;