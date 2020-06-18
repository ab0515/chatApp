import React, { useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
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
	const history = useHistory();
	const location = useLocation();
	const { classes } = props;

	const handleLogout = async (e) => {
		e.preventDefault();
		let res = await signout();
		console.log(res);
		history.push('/login');
	};

	if (location.pathname === '/signup' || location.pathname === '/login') {
		return false;
	} else {
		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" className={classes.title}>LetsChat</Typography>
						<Button color="inherit" onClick={handleLogout}>Log Out</Button>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
};

export default withStyles(styles)(NavBar);