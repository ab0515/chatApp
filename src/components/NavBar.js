import React, { useState } from 'react';
import { Redirect, useHistory, useLocation, Link } from 'react-router-dom';
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
	appbar: {
		zIndex: theme.zIndex.drawer + 1
	}
});

const NavBar = (props) => {
	const history = useHistory();
	const location = useLocation();
	const { classes, authenticated } = props;

	const handleLogout = async (e) => {
		e.preventDefault();
		let res = await signout();
		console.log(res);
		history.push('/login');
	};

	const handleLogo = e => {
		history.push('/dashboard');
	};

	if (location.pathname === '/signup' || location.pathname === '/login') {
		return false;
	} else {
		return (
			<div className={classes.root}>
				<AppBar position="relative" className={classes.appbar}>
					<Toolbar>
						<Button className={classes.title} onClick={handleLogo}>LetsChat</Button>
						<Button color="inherit" onClick={handleLogout}>{authenticated ? 'Log out' : 'Log in'}</Button>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
};

export default withStyles(styles)(NavBar);