import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, TextField, Button, Grid, InputAdornment, Paper } from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import withStyles from '@material-ui/core/styles/withStyles';

import { signup } from '../util/auth';

const styles = theme => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		paddingTop: theme.spacing(3),
		height: '100%',
		alignItems: 'center',
		backgroundImage: "linear-gradient(30deg, #eeb86d,#aab2ff,#eca0ff)",
	},
	signupForm: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: theme.spacing(3),
		alignItems: 'center'
	},
	link: {
		textDecoration: 'none'
	},
	gridContainer: {
		paddingTop: 15,
	},
	signupBtn: {
		borderRadius: 20,
		padding: 12,
		marginTop: 20,
	},
	signupPaper: {
		height: 400,
		width: 500,
		padding: 20,
		display: 'flex',
		alignItems: 'center'
	}
});

const Signup = (props) => {
	const { classes } = props;
	const [ user, setUser ] = useState({
		email: '',
		password: '',
		username: ''
	});

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
			signup(user.username, user.email, user.password);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={classes.root}>
			<Paper elevation={3} className={classes.signupPaper}>
				<Container component="main" maxWidth="xs">
					<form noValidate>
						<div className={classes.signupForm}>
							<Typography variant="h6">Create Account</Typography>
							<TextField 
								required
								name="username"
								label="Username"
								value={user.username}
								fullWidth
								margin="normal"
								onChange={handleChange}
								autoComplete="off"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircleOutlinedIcon />
										</InputAdornment>
									)
								}}
							/>
							<TextField 
								required
								name="email"
								label="Email"
								value={user.email}
								fullWidth
								margin="normal"
								onChange={handleChange}
								autoComplete="off"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlinedIcon />
										</InputAdornment>
									)
								}}
							/>
							<TextField 
								required
								name="password"
								label="Password"
								value={user.password}
								type="password"
								fullWidth
								margin="normal"
								onChange={handleChange}
								autoComplete="off"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<VpnKeyOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>
							<Button onClick={handleSubmit} 
									fullWidth
									variant="contained"
									color="primary"
									className={classes.signupBtn}
									disabled={!user.password || !user.email || !user.username}
							>Sign up</Button>
							
							<Grid container className={classes.gridContainer}>
								<Grid item xs>
									<Typography variant="body2">
										Already have an account? <Link to="/login" className={classes.link}>Log in</Link>
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

export default withStyles(styles)(Signup);