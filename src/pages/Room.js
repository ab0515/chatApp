import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, useAuth, getUser } from '../util/db';

import { Card, CardContent, Typography, CardActionArea, Button, Avatar } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';

const styles = (theme) => ({
	overrides: {
		MuiCardContent: {
			root: {
					padding: 0,
					"&:last-child": {
					paddingBottom: 0,
				},
			},
		},
	},
	root: {
		display: 'flex',
		flexDirection: 'column'
	},
	cards: {
		marginLeft: theme.spacing(3),
		marginBottom: theme.spacing(2),
		width: 300,
	},
	cardcontent: {
		padding: 12,
		display: 'flex',
		alignItems: 'center',
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
		const {backgroundColor, userid, username, profile} = props;
		return (
			<>
				<Card key={userid} className={classes.cards} style={{backgroundColor}}>
					<CardContent className={classes.cardcontent}>
						
							<Avatar src={profile}></Avatar>
							<Typography className={classes.black}>{username}</Typography>
							<Link key={userid} className={classes.usernames}
								to={{pathname: `/t/${username}`, state: { receiver: userid }}}>
									<Button>Message</Button>
							</Link>
					</CardContent>
				</Card>
				{/* <Card key={userid} className={classes.cards} style={{backgroundColor}}>
					<CardActionArea>
						<CardContent>
						<Link key={userid} className={classes.usernames}
							to={{pathname: `/t/${username}`, state: { receiver: userid }}}>
								<div className={classes.userslist}>
									<Avatar src={profile}></Avatar>
									<Typography className={classes.black}>{username}</Typography>
								</div>
							</Link>
						</CardContent>
					</CardActionArea>
				</Card> */}
			</>
		);
	}

	return loading ? <CircularProgress size={40} /> : (
		<div className={classes.root}>
			<Typography className={classes.title} variant="body1" color="textSecondary">Users</Typography>
			{users.map(member => {
				if (member.userid !== user.uid) {
					return <ListUsers 
								backgroundColor='#ade8f4'
								key={member.userid} 
								userid={member.userid} 
								username={member.username} 
								profile={member.imageAsUrl} />
				}
			})}
		</div>
	);
};

export default withStyles(styles)(Room);