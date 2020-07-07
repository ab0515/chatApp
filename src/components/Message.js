import React, { useState } from 'react';
import { Typography, Avatar, IconButton, Tooltip } from '@material-ui/core';
import { Dialog, Card, CardMedia, CardContent } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	box: {
		display: 'flex',
		margin: theme.spacing(1),
		alignItems: 'center'
	},
	textArea: {
		padding: 12,
		borderRadius: 15,
		fontSize: 14,
	},
	profile: {
		marginRight: 12
	},
	profileImage: {
		width: 300,
		height: 300,
	},
	username: {
		display: 'flex',
		justifyContent: 'center',
		fontSize: 24,
		fontWeight: 'bold',
		margin: 20,
		fontFamily: 'Arimo', 
	},
	textWidth: {
		maxWidth: 200,
	},
});

const Message = (props) => {
	const { classes, data, backgroundColor, isCurUser } = props;

	const [open, setOpen] = useState(false);

	const handleAvatar = () => {
		setOpen(true);
	};	

	const handleClose = () => {
		setOpen(false);
	}

	const Text = () => {
		return (
			<div className={classes.textWidth}>
				<Tooltip title={data.sentAt}>
					<Typography className={classes.textArea} style={{backgroundColor}}>{data.text}</Typography>
				</Tooltip>
			</div>
		);
	};

	return isCurUser ? (
		<div className={classes.box}>
			{/* <Typography className={classes.textArea} style={{backgroundColor}}>{data.text}</Typography> */}
			<Text />
		</div>
	) : (
		<div className={classes.box}>
			<IconButton onClick={handleAvatar}>
				<Avatar className={classes.profile} src={data.profileUrl} alt={data.sender[0]}></Avatar>
			</IconButton>
			{/* <Typography className={classes.textArea} style={{backgroundColor}}>{data.text}</Typography> */}
			<Text />

			<Dialog onClose={handleClose} aria-labelledby="zoom-profile" open={open}>
				<Card>
					<CardMedia
						className={classes.profileImage}
						component="img"
						image={data.profileUrl}
						src="/defaultProfile.png"
					/>
					<Typography className={classes.username}>
						{data.sender}
					</Typography>
				</Card>
			</Dialog>
		</div>
	);
};

export default withStyles(styles)(Message);