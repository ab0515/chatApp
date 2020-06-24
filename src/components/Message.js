import React from 'react';
import { Typography, Avatar } from '@material-ui/core';
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
	},
	profile: {
		marginRight: 12
	},
});

const Message = (props) => {
	const { classes, data, backgroundColor, isCurUser, profileUrl } = props;

	return isCurUser ? (
		<div className={classes.box}>
			<Typography className={classes.textArea} style={{backgroundColor}}>{data.text}</Typography>
		</div>
	) : (
		<div className={classes.box}>
			<Avatar className={classes.profile} src={profileUrl} alt={data.sender[0]}></Avatar>
			<Typography className={classes.textArea} style={{backgroundColor}}>{data.text}</Typography>
		</div>
	);
};

export default withStyles(styles)(Message);