import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signin, authMiddleWare } from '../util/auth';

import withStyles from '@material-ui/core/styles/withStyles';
import { Container, TextField, Typography, Button, Grid } from '@material-ui/core';

const styles = (theme) => ({
	root: {
		margin: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	link: {
		textDecoration: 'none',
	},
	gridContainer: {
		paddingTop: 15,
	}
});

const Login = (props) => {
	const [user, setUser] = useState({
		email: '',
		password: ''
	});
	const { classes } = props;

	useEffect(() => {
		authMiddleWare(props.history);
	}, []);

	const handleChange = (e) => {
		const {
			target: {name, value}
		} = e;
		setUser({
			...user,
			[name]: value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const token = signin(user.email, user.password);
		sessionStorage.setItem('AuthToken', `Bearer ${token}`);
	};

	return (
		<div>
			<Container component="main" maxWidth="xs">
				<form noValidate>
					<div className={classes.root}>
						<Typography variant="h6">Login</Typography>
						<TextField 
							required
							label="Email"
							variant="outlined"
							name="email"
							value={user.email}
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<TextField 
							required 
							label="Password"
							variant="outlined"
							name="password"
							value={user.password}
							type="password"
							onChange={handleChange}
							fullWidth
							margin="normal"
						/>
						<Button fullWidth 
								onClick={handleSubmit}
								variant="contained"
								color="primary"
						>Log in</Button>
						
						<Grid container className={classes.gridContainer}>
							<Grid item xs>
								<Typography variant="body2">
									<Link to="/signup" className={classes.link}>Doesn't have an account?</Link>
								</Typography>
							</Grid>
						</Grid>
					</div>
				</form>
			</Container>
		</div>
	)
};

export default withStyles(styles)(Login);