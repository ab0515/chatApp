import React, { useState } from 'react';
import { Redirect, useHistory, useLocation, Link } from 'react-router-dom';
import { AppBar, Toolbar, Grid, Button } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { signout } from '../util/auth';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
	},
	appname: {
		color: 'white',
		fontWeight: 'bold'
	},
	logoBtn: {
		display: 'flex',
		justifyContent: 'end',
	},
	logoutBtn: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	appbar: {
		zIndex: theme.zIndex.drawer + 1
	},
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
		history.push('/');
	};

	if (location.pathname === '/signup' || location.pathname === '/login') {
		return false;
	} else {
		return (
			<div className={classes.root}>
				<AppBar position="relative" className={classes.appbar}>
					<Toolbar>
						<Grid container justify="space-between">
							<Grid item><Button className={classes.appname} onClick={handleLogo}>LetsChat</Button></Grid>
							<Grid item><Button color="inherit" onClick={handleLogout}>{authenticated ? 'Log out' : 'Log in'}</Button></Grid>
						</Grid>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
};

export default withStyles(styles)(NavBar);