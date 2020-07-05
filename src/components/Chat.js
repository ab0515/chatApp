import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Message from './Message';
import { auth } from '../services/firebase';
import { useAuth, getUser, saveMessage, loadMessage } from '../util/db';

import { Container, Button, TextField, Grid, CircularProgress, Typography, IconButton, Paper } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	msgArea: {
		height: 600
	}, 
	curUser: {
		float: 'right',
	}, 
	message: {
		clear: 'both',
	}, 
	sendButton: {
		backgroundColor: '#390099',
		color: 'white',
		padding: 9,
	}, 
	textbox: {
		padding: 12,
	}, 
	btnSection: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: 12,
	}, 
	centerTexts: {
		display: 'flex',
		justifyContent: 'center'
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

		return unsubscribe;
	}, [location, user.uid]);

	useEffect(() => {
		getUser(user.uid)
			.then(doc => {
				let data = doc.data();
				setSender(data);
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
			sender: sender.username
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
				<Grid container className={classes.centerTexts}>
					<Grid item xs={8} md={8}>
						{/* <Paper> */}
						{
							chats.map((chat) => (
								chat.sender === sender.username ?
									(
										<div key={chat.sentAt} className={`${classes.curUser} ${classes.message}`}>
											<Message key={chat.sentAt} 
														data={chat} profileUrl={sender.imageAsUrl} 
														backgroundColor='#e9c46a' 
														isCurUser={true} />
										</div>
									) : (
										<div key={chat.sentAt} className={classes.message}>
											<Message key={chat.sentAt} 
														data={chat} 
														profileUrl={sender.imageAsUrl} 
														backgroundColor='#ffebee' 
														isCurUser={false} />
										</div>
									)
							))
						}
						{/* </Paper> */}
					</Grid>
				</Grid>
			</Container>

			<Container component="div">
				<form noValidate>
					<Grid container className={classes.centerTexts}>
                        <Grid item xs={8} md={7} className={classes.textbox}>
							<TextField 
								className={classes.textbox}
                                name="text" 
                                value={text} 
                                onChange={handleChange}
                                fullWidth
								variant="outlined"
								autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={8} md={1} className={classes.btnSection}>
                            <Button className={classes.sendButton} disabled={!text} fullWidth variant="contained" color="inherit" onClick={handleSubmit}>Send</Button>
                            {/* <IconButton className={classes.sendButton} onClick={handleSubmit}>
                                <ArrowUpwardIcon fontSize="small" />
                            </IconButton> */}
                        </Grid>
                    </Grid>
				</form>
			</Container>
		</div>
	)
}

export default withStyles(styles)(Chat);