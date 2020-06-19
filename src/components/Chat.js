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
	},
	msgArea: {
		height: 500
	},
});

const Chat = (props) => {
	const { classes } = props;
	let location = useLocation();
	const { initializing, user } = useAuth();
	const [roomName, setRoomName] = useState('');
	const [text, setText] = useState('');
	const [chats, setChats] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user.uid < location.state.receiver) {
			setRoomName(user.uid + location.state.receiver);
		} else {
			setRoomName(location.state.receiver + user.uid);
		}
	}, [location]);

	useEffect(() => {
		console.log(user.uid);
		getUser(user.uid)
			.then(doc => {
				let data = doc.data();
				console.log(data);
			})
			.catch(err => {
				console.log('Error retrieving user data', err);
			});
	}, []);

	const handleChange = (e) => {
		setText(e.target.value);
	};

	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	let data = {
	// 		text: text,
	// 		sentAt: new Date().toISOString(),
	// 		sender: sender
	// 	};

	// 	saveMessage(roomName, data)
	// 		.then(() => {
	// 			setText('');
	// 			console.log('Successfully sent message');
	// 		})
	// 		.catch(err => {
	// 			console.log('Error writing a message', err);
	// 		});
	// };

	return (
		<div>Message sent by</div>
	)

	// return loading ? <CircularProgress size={40} position="static" /> : (
	// 	<div>
	// 		<div className={classes.msgArea}>
	// 			{
	// 				chats.map(chat => (
	// 					chat.sender === sender 
	// 					? <Message key={chat.uid} data={chat} side="right"/> : <Message key={chat.uid} data={chat} side="left"/>
	// 				))
	// 			}
	// 		</div>
	// 		<Container component="main">
	// 			<form noValidate>
	// 				<Grid container className={classes.input}>
	// 					<Grid item xs={12} md={10}>
	// 						<TextField 
	// 							name="text" 
	// 							value={text} 
	// 							onChange={handleChange}
	// 							fullWidth
	// 						/>
	// 					</Grid>
	// 					<Grid item xs={12} md={2}>
	// 						<Button onClick={handleSubmit}>Send</Button>
	// 					</Grid>
	// 				</Grid>
	// 			</form>
	// 		</Container>
	// 	</div>
	// );
}

export default withStyles(styles)(Chat);