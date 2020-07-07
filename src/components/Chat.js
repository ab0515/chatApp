import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Message from './Message';
import { auth } from '../services/firebase';
import { useAuth, getUser, saveMessage, loadMessage } from '../util/db';

import { Container, Button, TextField, Grid, CircularProgress, Typography, IconButton, Divider } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	msgArea: {
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column-reverse',
		height: '70vh',
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
	footer: {
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
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		position: 'relative',
		padding: 10,
		paddingRight: 15,
		alignItems: 'center',
	},
	goBackBtn: {
		justifyContent: 'end',
	},
	receiverName: {
		fontWeight: 'bold',
	},
	footer: {
		bottom: 0,
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
	},
});

const Chat = (props) => {
	const { classes } = props;
	let location = useLocation();
	const history = useHistory();
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
		let profileUrl = sender.imageAsUrl ? sender.imageAsUrl : '';
		let data = {
			text: text,
			sentAt: new Date().toISOString(),
			sender: sender.username,
			profileUrl: profileUrl
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

	const handleGoBack = (e) => {
		history.push('/');
	};

	return loading ? <CircularProgress size={40} position="static" /> : (
		<div className={classes.root}>
			{/* header */}
			<Container component="div" className={classes.header}>
				<IconButton onClick={handleGoBack} className={classes.goBackBtn}>
					<ArrowBackIcon />
				</IconButton>
				<div className={classes.receiverName}>
					<Typography variant="subtitle1" className={classes.receiverName}>
						{receiver ? receiver.username : '' }
					</Typography>
				</div>
				<ViewHeadlineIcon />
			</Container>
			<Divider />
			{/* main */}
			<Container component="div" className={classes.msgArea}>
				<Grid container className={classes.centerTexts}>
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

			{/* footer */}
			<Container component="div" className={classes.footer}>
				<form noValidate className={classes.sendMsgForm}>
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
						onClick={handleSubmit}
					>
						Send
					</Button>
				</form>
			</Container>
		</div>
	)
}

export default withStyles(styles)(Chat);