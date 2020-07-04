import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Typ } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const style = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
		height: 500
	},
	noDeco: {
		textDecoration: 'none'
	},
	newAccountBtn: {
		padding: 12,
		backgroundColor: '#1b6ca8',
		color: '#fff',
		marginBottom: 13,
		width: '20em'
	},
	loginBtn: {
		padding: 12,
		width: '20em',
	},
});

const Home = (props) => {
	const { classes } = props;

	return (
		<div className={classes.root}>			
			<Link className={classes.noDeco} to="/signup">
				<Button className={classes.newAccountBtn} variant="contained" color="inherit">Create a new account</Button>
			</Link>
			<Link className={classes.noDeco} to="/login">
				<Button className={classes.loginBtn} variant="outlined" color="primary">Login to your account</Button>
			</Link>
		</div>
	);
};

export default withStyles(style)(Home);