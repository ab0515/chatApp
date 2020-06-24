import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { getUser, useAuth, postProfilePicture } from '../util/db';

import withStyles from'@material-ui/core/styles/withStyles';
import { Card, CardContent, Typography, Button, Avatar } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ErrorIcon from '@material-ui/icons/Error';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	root: {},
	details: {
		display: 'flex',
	},
	toolbar: theme.mixins.toolbar,
	uploadButton: {
		marginLeft: 8,
		margin: theme.spacing(1)
	},
	name: {
		paddingLeft: 10
	},
	large: {
		width: theme.spacing(11),
		height: theme.spacing(11),
	},
	errorMsg: {
		color: 'red'
	},
});

const Account = (props) => {
	const { classes, ...rest } = props;
	const [userdata, setUserData] = useState('');
	const { initializing, user } = useAuth();
	const allInputs = {imgUrl: ''}
	const [imageAsFile, setImageAsFile] = useState('');
	const [imageAsUrl, setImageAsUrl] = useState(allInputs);
	const [error, setError] = useState('');

	useEffect(() => {
		// console.log(res);
		getUser(user.uid)
			.then(doc => {
				if (doc.exists) {
					setUserData(doc.data());
				} else {
					console.log('No such document');
				}
			})
			.catch(err => {
				console.log('Error getting current user data', err);
			});
	}, [user.uid]);

	const handleImageChange = (e) => {
		const image = e.target.files[0];
		setImageAsFile(imageFile => (image));
	};

	const profilePicHandler = (e) => {
		e.preventDefault();
		console.log(imageAsFile);
		if (imageAsFile === '' || imageAsFile === null) {
			setError(`Not an image, the image file is ${typeof(imageAsFile)}`);
		}
		postProfilePicture(user.uid, imageAsFile)
			.then(() => {
				console.log('successfully uploaded');
				window.location.reload();
			})
			.catch(err => {
				console.log('Failed');
			})
	};

	return (
		<main className={classes.content}>
			<div className={classes.toolbar}>
				<Card {...rest} className={clsx(classes.root, classes)} >
					<CardContent>
						<div className={classes.details}>
							<center>
								<Avatar className={classes.large} src={userdata.imageAsUrl} />
								<Typography className={classes.name} gutterBottom variant="h5">
									{userdata.username}
								</Typography>

								<Button
									variant="outlined"
									color="primary"
									type="submit"
									size="small"
									startIcon={<CloudUploadIcon />}
									className={classes.uploadButton}
									onClick={profilePicHandler}
								>Upload Photo</Button>
								
								<input type="file" onChange={handleImageChange} />

								{/* {this.state.imageError ? (
									<div className={classes.customError}>
										{' '}
										Wrong Image Format || Supported Format are PNG and JPG
									</div>
								) : (
									false
								)} */}
							</center>
							{error ? (
								<div className={classes.details}> 
									<ErrorIcon /> <Typography className={classes.errorMsg} variant="body2">{error}</Typography> 
								</div> 
							)							
							: false}
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
};

export default  withStyles(styles)(Account);