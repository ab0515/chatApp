import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Message from './Message';
import { auth } from '../services/firebase';
import { useAuth, getUser, saveMessage, loadMessage } from '../util/db';

import { Container, Button, TextField, Grid, CircularProgress, Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	msgArea: {
		height: 620,
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column-reverse'
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
		width: 'auto',
		height: 40,
	}, 
	textbox: {
		padding: 12,
	}, 
	centerItems: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}, 
	centerTexts: {
		justifyContent: 'center'
	},
	sendMsgForm: {
		display: 'flex' ,
		width: '500px',
		alignItems: 'center',
	},
	chatWidth: {
		width: 500,
	},
});

const Chat = (props) => {
	const { classes } = props;
	let location = useLocation();
	let receiver = location ? location.state.receiver : null;
	const { initializing, user } = useAuth();
	const [roomName, setRoomName] = useState('');
	
	const [error, setError] = useState('');
	const [text, setText] = useState('');
	const [chats, setChats] = useState('');
	const [loading, setLoading] = useState(true);
	const [sender, setSender] = useState('');

	useEffect(() => {
		let name;
		// let receiver = location.state.receiver;

		if (user.uid < receiver.userid) {
			name = user.uid + receiver.userid;
		} else {
			name = receiver.userid + user.uid;
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
			sender: sender.username,
			profileUrl: sender.imageAsUrl
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
		<div className={classes.root}>
			<Container component="main" className={classes.msgArea}>
				<Grid container className={classes.centerTexts}>
					<Grid item>
						<Typography>{receiver ? receiver.username : '' }</Typography>
					</Grid>
					<Grid item className={classes.chatWidth}>
						{
							chats.map((chat) => (
								chat.sender === sender.username ?
									(	
										// current user
										<div key={chat.sentAt} className={`${classes.curUser} ${classes.message}`}>
											<Message key={chat.sentAt} 
														data={chat}
														backgroundColor='#e9c46a' 
														isCurUser={true} />
										</div>
									) : (
										// another user
										<div key={chat.sentAt} className={classes.message}>
											<Message key={chat.sentAt} 
														data={chat}  
														backgroundColor='#ffebee' 
														isCurUser={false} />
										</div>
									)
							))
						}
					</Grid>
				</Grid>
			</Container>

			<Container component="div" className={classes.centerItems}>
				<form noValidate className={classes.sendMsgForm}>
					{/* <Grid container className={classes.centerTexts}>
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
                        <Grid item xs={8} md={1}>
                            <Button className={classes.sendButton} disabled={!text} fullWidth variant="contained" color="inherit" onClick={handleSubmit}>Send</Button>
                        </Grid>
                    </Grid> */}

						<TextField 
							className={classes.textbox} fullWidth
							name="text" value={text} 
							onChange={handleChange}
							variant="outlined"
							autoComplete="off"
						/>
						<Button 
							className={classes.sendButton} fullWidth
							disabled={!text}  
							variant="contained" color="inherit" 
							onClick={handleSubmit}>
						Send
						</Button>
				</form>
			</Container>
		</div>
	)
}

export default withStyles(styles)(Chat);