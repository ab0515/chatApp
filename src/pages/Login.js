import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../util/auth';

import withStyles from '@material-ui/core/styles/withStyles';
import { Container, TextField, Typography, Button, Grid, Snackbar, InputAdornment, Paper } from '@material-ui/core';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: theme.spacing(3),
		height: '100%',
		backgroundImage: 'linear-gradient(45deg, #7ef29d, #0f68a9)'
	},
	formclass: {
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
	},
	loginBtn: {
		borderRadius: 20,
		padding: 12,
		marginTop: 12,
	},
	loginForm: {
		width: 500,
		height: 400,
		display: 'flex',
		alignItems: 'center',
		padding: 20,
	},
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
		<div className={classes.root}>
			<Paper className={classes.loginForm} elevation={3}>
				<Container component="main" maxWidth="xs">
					<form noValidate>
						<div className={classes.formclass}>
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
								name="email"
								value={user.email}
								onChange={handleChange}
								fullWidth
								margin="normal"
								autoComplete="off"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>
							<TextField 
								required 
								label="Password"
								name="password"
								value={user.password}
								type="password"
								onChange={handleChange}
								fullWidth
								margin="normal"
								autoComplete="off"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<VpnKeyOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>
							<Button fullWidth 
									onClick={handleSubmit}
									variant="contained"
									color="primary"
									className={classes.loginBtn}
									disabled={!user.email || !user.password}
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
			</Paper>
		</div>
	)
};

export default withStyles(styles)(Login);