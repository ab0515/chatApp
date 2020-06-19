import React from 'react';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({

});

const Message = (props) => {
	const { classes, data, side } = props;

	return (
		<div styles={{float: side}}>
			<Typography>{data.sender[0]}</Typography>
			<Typography variant="body1">{data.text}</Typography>
		</div>
	);
};

export default withStyles(styles)(Message);