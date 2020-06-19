import React from 'react';
import { Typography, Avatar } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	box: {
		display: 'flex'
	}
});

const Message = (props) => {
	const { classes, data } = props;

	return (
		<div className={classes.box}>
			<Avatar>{data.username[0]}</Avatar>
			<Typography>{data.text}</Typography>
		</div>
	);
};

export default withStyles(styles)(Message);