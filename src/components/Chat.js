import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getUser, saveMessage } from '../util/db';

import { Container, Button, TextField, Grid } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	input: {
		display: 'flex',
	},
});

const Chat = (props) => {
	const { classes } = props;
	let location = useLocation();
	const [receiver, setReceiver] = useState('');
	const [sender, setSender] = useState('');
	const [roomName, setRoomName] = useState('');
	const [text, setText] = useState('');

	useEffect(() => {
		setReceiver(location.state.receiver);

		auth.onAuthStateChanged(user => {
			if (user) { // logged in
				let curUser = auth.currentUser;
				
				if (curUser.uid < location.state.receiver) {
					setRoomName(curUser.uid + location.state.receiver);
				} else {
					setRoomName(location.state.receiver + curUser.uid);
				}

				getUser(curUser.uid)
					.then(doc => {
						let user = doc.data();
						setSender(user.username);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				props.history.push('/login');
			}
		});
	}, [location]);

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

	return (
		<div>

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
	);
}

export default withStyles(styles)(Chat);