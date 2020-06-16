import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import { signout } from '../util/auth';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
	},
});

const NavBar = (props) => {
	const { classes } = props;
	const [ signedout, setSignedout ] = useState(false);

	const logout = (e) => {
		e.preventDefault();
		signout();
		setSignedout(true);
	};

	return signedout ? <div><Redirect to={{ pathname: '/login' }} /></div> : (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>LetsChat</Typography>
					<Button color="inherit" onClick={logout}>Log Out</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default withStyles(styles)(NavBar);