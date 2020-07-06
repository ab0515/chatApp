import React, { useEffect, useState } from 'react';
import { getUsers, useAuth, getUser } from '../util/db';
import LinkButton from '../components/LinkButton';

import { Card, CardContent, Typography, Avatar, Grid } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	cards: {
		marginLeft: theme.spacing(3),
		marginBottom: theme.spacing(2),
		width: 300,
		display: 'flex',
	},
	cardcontent: {
		padding: 12,
		'&:last-child': {
			paddingBottom: 12,
		},
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	usernames: {
		textDecoration: 'none'
	},
	black: {
		color: 'black',
		paddingLeft: 15
	},
	title: {
		paddingLeft: 23,
		paddingTop: 5
	},
	sendIcon: {
		float: 'right',
	},
	sendBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 12,
	},
	verticalCenter: {
		display: 'flex',
		alignItems: 'center',
	},
});

const Room = (props) => {
	const { classes } = props;
	const { initializing, user } = useAuth();
	const [curUser, setCurUser] = useState('');
	const [users, setUsers] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isSubscribed = true;
		let temp = [];
		setLoading(true);

		getUsers().then(snapshot => {
			if (snapshot.empty) {
				console.log('no matching data');
				return;
			} 
			snapshot.forEach(doc => {
				temp.push(doc.data());
			});
			return temp;
		})
		.then(temp => {
			if (isSubscribed) {
				setUsers(temp);
				setLoading(false);
			}
		})
		.catch(err => {
			console.log('Error while retrieving data', err);
		}); 
		
		getUser(user.uid)
			.then(doc => {
				if (doc.exists && isSubscribed) {
					setCurUser(doc.data());
				} else {
					console.log('User doesn\'t have data');
				}
			})
			.catch(err => {
				console.log('Error getting user data', err);
			});

		return () => isSubscribed = false;
	}, [user.uid]);

	const ListUsers = (props) => {
		const { userData } = props;
		return (
			<>
				<Card key={userData.userid} className={classes.cards} elevation={2}>
					<CardContent className={classes.cardcontent}>
						<Grid container justify="space-between">
							<Grid item className={classes.verticalCenter}>
								<Avatar src={userData.imageAsUrl}></Avatar>
								<Typography className={classes.black}>{userData.username}</Typography>
							</Grid>
							<Grid item className={classes.verticalCenter}>
								<LinkButton
									className={classes.sendBtn}
									to={`/t/${userData.username}`}
									receiver={userData}
								/>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</>
		);
	}

	return loading ? <CircularProgress size={40} /> : (
		<div className={classes.root}>
			<Typography className={classes.title} variant="body1" color="textSecondary">Users</Typography>
			{users.map(member => {
				if (member.userid !== user.uid) {
					return <ListUsers 
								backgroundColor='#f7ede2'
								key={member.userid} 
								userData={member} />
				}
			})}
		</div>
	);
};

export default withStyles(styles)(Room);