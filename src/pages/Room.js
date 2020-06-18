import React, { useEffect, useState } from 'react';
import { getUsers } from '../util/db';

import { Card, CardContent, Typography, CardActionArea } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
	cards: {
		margin: theme.spacing(2)
	},
	usernames: {
		textDecoration: 'none'
	}
});

const Room = (props) => {
	const { classes } = props;
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
		return () => isSubscribed = false;
	}, [props.history]);

	const handleClick = (e) => {
		console.log('clicked');
	}

	// return (
	// 	<div>
	// 		<Typography variant="body1">Chatting room</Typography>
	// 	</div>
	// );
	return loading ? <CircularProgress size={40} /> : (
		<div>
			{users.map(user => (
				<Link key={user.userid} className={classes.usernames}
						to={{ pathname: `/t/${user.username}`, state: { receiver: user.userid } }}>
					<Card key={user.userid} className={classes.cards}>
						<CardActionArea onClick={handleClick}>
							<CardContent>
								<Typography>{user.username}</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Link>
			))}
		</div>
	);
};

export default withStyles(styles)(Room);