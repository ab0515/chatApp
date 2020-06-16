import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, TextField, Button, Grid } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import { signup, authMiddleWare } from '../util/auth';

const styles = theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		margin: theme.spacing(2),
		alignItems: 'center'
	},
	link: {
		textDecoration: 'none'
	},
	gridContainer: {
		paddingTop: 15,
	},
});

const Signup = (props) => {
	const { classes } = props;
	const [ user, setUser ] = useState({
		email: '',
		password: '',
		username: ''
	});

	useEffect(() => {
		authMiddleWare(props.history);
	}, []);

	const handleChange = (e) => {
		const {
			target: { name, value }
		} = e;
		setUser({
			...user,
			[name]: value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			const token = signup(user.username, user.email, user.password);
			sessionStorage.setItem('AuthToken', `Bearer ${token}`);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<Container component="main" maxWidth="xs">
				<form noValidate>
					<div className={classes.root}>
						<Typography>Sign up</Typography>
						<TextField 
							required
							name="username"
							label="Username"
							value={user.username}
							fullWidth
							margin="normal"
							variant="outlined"
							onChange={handleChange}
						/>
						<TextField 
							required
							name="email"
							label="Email"
							value={user.email}
							fullWidth
							margin="normal"
							variant="outlined"
							onChange={handleChange}
						/>
						<TextField 
							required
							name="password"
							label="Password"
							value={user.password}
							type="password"
							fullWidth
							margin="normal"
							variant="outlined"
							onChange={handleChange}
						/>
						<Button onClick={handleSubmit} 
								fullWidth
								variant="contained"
								color="primary"
						>Sign up</Button>
						
						<Grid container className={classes.gridContainer}>
							<Grid item xs>
								<Typography variant="body2">
									<Link to="/login" className={classes.link}>Already have an account?</Link>
								</Typography>
							</Grid>
						</Grid>
					</div>
				</form>
			</Container>
		</div>
	)
};

export default withStyles(styles)(Signup);