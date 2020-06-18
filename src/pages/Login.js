import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../util/auth';

import withStyles from '@material-ui/core/styles/withStyles';
import { Container, TextField, Typography, Button, Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
	const [errors, setErrors] = useState('');
	const [errorOpen, setErrorOpen] = useState(false);
	const [pos, setPos] = useState({
		vertical: 'top', horizontal: 'center'
	});

	const { classes } = props;

	const handleChange = (e) => {
		const {
			target: {name, value}
		} = e;
		setUser({
			...user,
			[name]: value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		signin(user.email, user.password)
			.then((data) => {
				let token = data.user.getIdToken();
				// sessionStorage.setItem('AuthToken', `Bearer ${token}`);
			})
			.catch(err => {
				setErrorOpen(true);
				setErrors("Authentication failed. Please try again");
			});
	};

	const handleClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setErrorOpen(false);
	};

	return (
		<div>
			<Container component="main" maxWidth="xs">
				<form noValidate>
					<div className={classes.root}>
						<Typography variant="h6">Login</Typography>
						<Snackbar open={errorOpen} 
									autoHideDuration={6000} 
									onClose={handleClose} 
									anchorOrigin={pos}>
							<Alert onClose={handleClose} severity="error">
								{errors}
							</Alert>
						</Snackbar>
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
									Doesn't have an account? <Link to="/signup" className={classes.link}>Sign up</Link>
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