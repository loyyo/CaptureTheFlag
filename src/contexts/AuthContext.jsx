import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { auth, db, storageRef } from '../firebase.js';
import cryptoRandomString from 'crypto-random-string';
import { useNavigate } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [thisUserData, setThisUserData] = useState();
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);
	const [currentUserData, setCurrentUserData] = useState();
	const [allUsersData, setAllUsersData] = useState([]);
	const [allChallengesData, setAllChallengesData] = useState([]);
	const [singleChallengeData, setSingleChallengeData] = useState([]);
	const navigate = useNavigate();

	const messagesRef = db.collection('globalchatmessages');
	const messageQuery = messagesRef.orderBy('createdAt').limit(100);
	const [globalMessages] = useCollectionData(messageQuery, { idField: 'id' });

	const login = useCallback(async (email, password) => {
		await auth.signInWithEmailAndPassword(email, password);
	}, []);

	const logout = useCallback(async () => {
		await auth.signOut();
	}, []);

	const resetPassword = useCallback(async (email) => {
		await auth.sendPasswordResetEmail(email);
	}, []);

	const updateEmail = useCallback(
		async (email) => {
			await currentUser.updateEmail(email);
		},
		[currentUser]
	);

	const updatePassword = useCallback(
		async (password) => {
			await currentUser.updatePassword(password);
		},
		[currentUser]
	);

	const createProfile = useCallback(async (username, email) => {
		let userID = cryptoRandomString({ length: 28, type: 'alphanumeric' });

		try {
			await db.collection('users').doc(`${email}`).set({
				avatar:
					'https://firebasestorage.googleapis.com/v0/b/capturetheflag-mw.appspot.com/o/avatars%2F0wli9hCJ8mTJbvj.png?alt=media',
				bio: 'There is nothing to see here unfortunately :(',
				challenges: {},
				createdAt: new Date(),
				email: email,
				points: 0,
				username: username,
				userID: userID,
			});
		} catch (error) {
			console.error('Error adding document: ', error);
		}
	}, []);

	const signup = useCallback(
		async (email, password, username) => {
			await auth.createUserWithEmailAndPassword(email, password);
			createProfile(username, email);
		},
		[createProfile]
	);

	const getProfile = useCallback(async () => {
		try {
			const doc = await db.collection('users').doc(currentUser.email).get();
			if (doc.exists) {
				let Data = doc.data();
				setCurrentUserData(Data);
			} else {
				console.error('No such document!');
			}
		} catch (error) {
			console.error('Error getting document:', error);
		}
	}, [currentUser]);

	const getAllUsersData = useCallback(async () => {
		let Data = [];

		try {
			const querySnapshot = await db
				.collection('users')
				.orderBy('points', 'desc')
				.limit(1000)
				.where('points', '>', 0)
				.get();
			querySnapshot.forEach((doc) => {
				Data.push(doc.data());
			});
			setAllUsersData(Data);
		} catch (error) {
			console.error('Error getting documents:', error);
		}
	}, []);

	const getAllChallengesData = useCallback(async () => {
		let Data = [];

		try {
			const querySnapshot = await db.collection('challenges').get();
			querySnapshot.forEach((doc) => {
				Data.push(doc.data());
			});
			setAllChallengesData(Data);
		} catch (error) {
			console.error('Error getting documents:', error);
		}
	}, []);

	const getSingleChallengeData = useCallback(
		async (url) => {
			let Data = [];

			await db
				.collection('challenges')
				.doc(url)
				.get()
				.then((doc) => {
					if (doc.exists) {
						Data.push(doc.data());
					} else {
						console.error('No such document!');
						navigate('/error404');
					}
				})
				.then(() => {
					setSingleChallengeData(Data);
				})
				.catch((error) => {
					console.error('Error getting document: ', error);
				});
		},
		[navigate]
	);

	const updateUsername = useCallback(async (email, username) => {
		await db
			.collection('users')
			.doc(`${email}`)
			.update({
				username: username,
			})
			.catch((error) => {
				console.error('Error updating document: ', error);
			});
	}, []);

	const updateBio = useCallback(async (email, bio) => {
		await db
			.collection('users')
			.doc(`${email}`)
			.update({
				bio: bio,
			})
			.catch((error) => {
				console.error('Error updating document: ', error);
			});
	}, []);

	const updateAvatar = useCallback(async (email, file) => {
		let filename = cryptoRandomString({ length: 28, type: 'alphanumeric' });
		let filetype = file.type.slice(6);
		let fullfilename = `${filename}.${filetype}`;

		let metadata = {
			contentType: file.type,
		};

		storageRef.child('avatars/' + fullfilename).put(file, metadata);

		let avatar = `https://firebasestorage.googleapis.com/v0/b/capturetheflag-mw.appspot.com/o/avatars%2F${fullfilename}?alt=media`;

		await db
			.collection('users')
			.doc(`${email}`)
			.update({
				avatar: avatar,
			})
			.catch((error) => {
				console.error('Error updating document: ', error);
			});
	}, []);

	const doChallenge = useCallback(async (url, challengePoints, user, userPoints) => {
		let points = challengePoints + userPoints;

		await db
			.collection('users')
			.doc(user)
			.update({
				points: points,
				[`challenges.${url}`]: true,
			})
			.catch((error) => {
				console.error('Error updating document: ', error);
			});
	}, []);

	const getUserProfile = useCallback(
		async (user) => {
			let exist = false;
			await db
				.collection('users')
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						let Data = doc.data();
						if (Data.userID === user) {
							setThisUserData(Data);
							exist = true;
						}
					});
					if (!exist) navigate('/error404');
				})
				.catch(function (error) {
					console.error('Error getting user:', error);
				});
		},
		[navigate]
	);

	const sendMessage = useCallback(async (text, userID) => {
		await db
			.collection('globalchatmessages')
			.add({
				createdAt: new Date(),
				text: text,
				userID: userID,
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	}, []);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = useMemo(
		() => ({
			currentUser,
			thisUserData,
			currentUserData,
			allUsersData,
			allChallengesData,
			singleChallengeData,
			globalMessages,
			sendMessage,
			getUserProfile,
			login,
			logout,
			signup,
			updatePassword,
			updateEmail,
			getProfile,
			createProfile,
			updateUsername,
			updateBio,
			updateAvatar,
			getAllUsersData,
			getAllChallengesData,
			getSingleChallengeData,
			doChallenge,
			resetPassword,
		}),
		[
			currentUser,
			thisUserData,
			currentUserData,
			allUsersData,
			allChallengesData,
			singleChallengeData,
			globalMessages,
			sendMessage,
			getUserProfile,
			login,
			logout,
			signup,
			updatePassword,
			updateEmail,
			getProfile,
			createProfile,
			updateUsername,
			updateBio,
			updateAvatar,
			getAllUsersData,
			getAllChallengesData,
			getSingleChallengeData,
			doChallenge,
			resetPassword,
		]
	);

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
