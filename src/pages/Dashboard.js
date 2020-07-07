import React, { useState, useEffect } from 'react';
import { getUser, useAuth } from '../util/db';

import Room from '../pages/Room';
import Account from '../pages/Account';

import withStyles from '@material-ui/core/styles/withStyles';
import { Avatar, Divider, Drawer, CircularProgress, Typography } from '@material-ui/core';
import { List, ListItemText, ListItem } from '@material-ui/core';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	profileSection: {
		padding: 15, 
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
	}
});

const Dashboard = (props) => {
	const { classes } = props;
	const { initializing, user } = useAuth();
	const [ userData, setUserData ] = useState('');
	const [state, setState] = useState({render: true});

	useEffect(() => {
		getUser(user.uid)
			.then(doc => {
				if (doc.exists) {
					setUserData(doc.data());
					console.log(doc.data());
				} else {
					console.log('User doesn\'t have data');
				}
			})
			.catch(err => {
				console.log('Error getting user data', err);
			})
	}, [user.uid]);

	const loadUsersPage = (e) => {
		setState({render: true});
	};

	const loadAccountPage = (e) => {
		setState({render: false});
	};

	return initializing ? (
		<div>
			<CircularProgress size={40}/>
		</div>
	) : (
		<div className={classes.root}>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper
				}}
			>	
				<div className={classes.toolbar} />
				<Divider />
				<center className={classes.profileSection}>
					<Avatar src={userData.imageAsUrl} />
					<Typography variant="h6">{ userData.username }</Typography>
				</center>
				<Divider />
				<List>
					<ListItem button key="Users" onClick={loadUsersPage}>
						<ListItemText primary="Users" />
					</ListItem>

					<ListItem button key="Account" onClick={loadAccountPage}>
						<ListItemText primary="My Profile" />
					</ListItem>
				</List>
			</Drawer>
			<main className={classes.content}>
				{state.render ? <Room /> : < Account /> }
			</main>
		</div>
	)
};

export default withStyles(styles)(Dashboard);