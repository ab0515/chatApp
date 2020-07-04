import React, { useEffect, useState } from 'react';
import { getUsers, useAuth, getUser } from '../util/db';

import { Card, CardContent, Typography, CardActionArea, Divider, Avatar } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	cards: {
		margin: theme.spacing(3)
	},
	usernames: {
		textDecoration: 'none'
	},
	userslist: {
		display: 'flex',
		alignItems: 'center',
	},
	black: {
		color: 'black',
		paddingLeft: 15
	},
	title: {
		paddingLeft: 23,
		paddingTop: 5
	}
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
				console.log(temp);
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

	const handleClick = (e) => {
		console.log('clicked');
	}

	const ListUsers = (props) => {
		return (
			<>
				<Card key={props.userid} className={classes.cards}>
					<CardActionArea>
						<CardContent>
						<Link key={props.userid} className={classes.usernames}
							to={{pathname: `/t/${props.username}`, state: { receiver: props.userid }}}>
								<div className={classes.userslist}>
									<Avatar src={props.profile}></Avatar>
									<Typography className={classes.black}>{props.username}</Typography>
								</div>
							</Link>
						</CardContent>
					</CardActionArea>
				</Card>
			</>
		);
	}

	return loading ? <CircularProgress size={40} /> : (
		<div className={classes.root}>
			<ListUsers userid={user.uid} username={curUser.username} profile={curUser.imageAsUrl}></ListUsers>
			<Divider />
			<Typography className={classes.title} variant="body1" color="textSecondary">Users</Typography>
			{users.map(member => {
				if (member.userid !== user.uid) {
					return <ListUsers key={member.userid} userid={member.userid} username={member.username} profile={member.imageAsUrl}></ListUsers>
				}
			})}
		</div>
	);
};

export default withStyles(styles)(Room);