import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Message from './Message';
import { auth } from '../services/firebase';
import { useAuth, getUser, saveMessage, loadMessage } from '../util/db';

import { Container, Button, TextField, Grid, CircularProgress, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	input: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column'
	},
	msgArea: {
		height: 500
	},
	curUser: {
		float: 'right'
	}
});

const Chat = (props) => {
	const { classes } = props;
	let location = useLocation();
	const { initializing, user } = useAuth();
	const [roomName, setRoomName] = useState('');
	const [error, setError] = useState('');
	const [text, setText] = useState('');
	const [chats, setChats] = useState('');
	const [loading, setLoading] = useState(true);
	const [sender, setSender] = useState('');

	useEffect(() => {
		let name;
		if (user.uid < location.state.receiver) {
			name = user.uid + location.state.receiver;
		} else {
			name = location.state.receiver + user.uid;
		}

		setRoomName(name);
		const unsubscribe = loadMessage(name, {
			next: querySnapShot => {
				const updatedData = querySnapShot.docs.map(snapshot => snapshot.data());
				setChats(updatedData);
				setLoading(false);
			},
			error: () => setError('Message loading failed')
		});
			// .onSnapshot(snap => {
			// const data = snap.docs.map(doc => doc.data());
			// console.log(data);
			// setChats(data);
		// });

		return unsubscribe;
	}, [location]);

	useEffect(() => {
		getUser(user.uid)
			.then(doc => {
				let data = doc.data();
				console.log(data);
				setSender(data.username);
			})
			.catch(err => {
				console.log('Error retrieving user data', err);
			});
	}, []);

	const handleChange = (e) => {
		setText(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let data = {
			text: text,
			sentAt: new Date().toISOString(),
			sender: sender
		};

		saveMessage(roomName, data)
			.then(() => {
				setText('');
				console.log('Successfully sent message');
			})
			.catch(err => {
				console.log('Error writing a message', err);
			});
	};

	return loading ? <CircularProgress size={40} position="static" /> : (
		<div>
			<div className={classes.msgArea}>
				{
					chats.map((chat, id) => (
						chat.sender === sender ?
							<Message className={classes.curUser} key={chat.sentAt} data={chat} /> : 
							<Message key={chat.sentAt} data={chat} />
					))
				}
			</div>
			<Container component="main">
				<form noValidate>
					<Grid container className={classes.input}>
						<Grid item xs={12} md={10}>
							<TextField 
								name="text" 
								value={text} 
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<Button onClick={handleSubmit}>Send</Button>
						</Grid>
					</Grid>
				</form>
			</Container>
		</div>
	)
}

export default withStyles(styles)(Chat);