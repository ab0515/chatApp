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
		height: 600
	},
	curUser: {
		float: 'right',
	},
	message: {
		clear: 'both',
	},
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

	// useEffect(() => {
	// 	setSender('charlie');
	// 	setChats([{
	// 		text:'this is message 1',
	// 		sender: 'lily',
	// 		sentAt: '2020-06-20T00:02:15.732Z'
	// 	}, {
	// 		text: 'hello this is line 2',
	// 		sender: 'lily',
	// 		sentAt: '2020-06-20T00:04:15.732Z'
	// 	}, {
	// 		text: 'lets have a party',
	// 		sender: 'charlie',
	// 		sentAt: '2020-06-20T00:05:22.732Z',
	// 	}]);
	// 	setLoading(false);
	// }, [])

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

		return unsubscribe;
	}, [location, user.uid]);

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
	}, [user.uid]);

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
			<Container component="main" className={classes.msgArea}>
				<Grid container>
					<Grid item xs={12} md={10}>
						{
							chats.map((chat) => (
								chat.sender === sender ?
									<div className={`${classes.curUser} ${classes.message}`}><Message key={chat.sentAt} data={chat} backgroundColor='#6FB5D8' isCurUser={true} /></div> : 
										<div className={classes.message}><Message key={chat.sentAt} data={chat} backgroundColor='#ffebee' isCurUser={false} /></div>
							))
						}
					</Grid>
				</Grid>
			</Container>

			<Container component="div">
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