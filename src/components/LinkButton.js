import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Button } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
	root: {
		color: 'white',
		backgroundColor: '#086375',
	}
});

const LinkButton = (props) => {
	const {
		classes,
		history,
		location,
		match,
		staticContext,
		to,
		receiver,
		onClick,
		...rest
	} = props;

	// console.log(location);

	return (
		<Button
			{...rest} // `children` is just another prop!
			onClick={(event) => {
				onClick && onClick(event)
				history.push({
					pathname: to,
					state: {receiver: receiver}
				})
			}}
			variant="contained"
			disableElevation
			className={classes.root}
		>
			Send
		</Button>
	);
}

export default withStyles(styles)(withRouter(LinkButton));