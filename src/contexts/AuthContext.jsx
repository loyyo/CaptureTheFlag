import React, {useContext, useState, useEffect, useMemo, useCallback} from 'react';
import {auth, db, storageRef} from '../firebase.js';
import cryptoRandomString from 'crypto-random-string';
import {useNavigate} from 'react-router-dom';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import PropTypes from 'prop-types';
import firebase from "firebase/compat/app";

const AuthContext = React.createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({children}) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode'));
    const [thisUserData, setThisUserData] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [currentUserData, setCurrentUserData] = useState();
    const [allUsersData, setAllUsersData] = useState([]);
    const [allChallengesData, setAllChallengesData] = useState([]);
    const [singleChallengeData, setSingleChallengeData] = useState([]);
    const [challengeStats, setChallengeStats] = useState([]);
    const navigate = useNavigate();

    const messagesRef = db.collection('globalchatmessages');
    const messageQuery = messagesRef.orderBy('createdAt').limit(100);
    const [globalMessages] = useCollectionData(messageQuery, {idField: 'id'});

    const switchDarkMode = useCallback(() => {
        let darkModeVar = localStorage.getItem('darkMode');
        if (!darkModeVar || darkModeVar === '' || darkModeVar === 'false') {
            localStorage.setItem('darkMode', 'true');
            setDarkMode('true');
        } else if (darkModeVar === 'true') {
            localStorage.setItem('darkMode', 'false');
            setDarkMode('false');
        }
    }, []);

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
        let userID = cryptoRandomString({length: 28, type: 'alphanumeric'});

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
        let filename = cryptoRandomString({length: 28, type: 'alphanumeric'});
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

        await db
            .collection('challenges')
            .doc(url)
            .update({
                completedBy: firebase.firestore.FieldValue.increment(1)
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    }, []);

    const calculateRanking = (usersData, currentUserPoints, currentUserId) => {
        let rank = 1;
        let usersWithMorePoints = 0;

        usersData.forEach(user => {
            if (user.userID !== currentUserId) {
                const userPoints = user.points || 0;
                if (userPoints < currentUserPoints) {
                    usersWithMorePoints++;
                }
            }
        });

        rank += usersWithMorePoints;
        return rank;
    };


    const getChallengeStats = async () => {
        const userDataSnapshot = await db.collection('users').doc(currentUserData.email).get();
        if (!userDataSnapshot.exists) {
            console.error('User data not found');
            return null;
        }
        const userData = userDataSnapshot.data();
        const userChallenges = userData.challenges || {};

        const challengesSnapshot = await db.collection('challenges').get();
        const challenges = challengesSnapshot.docs.map(doc => doc.data());

        const usersSnapshot = await db.collection('users').get();
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        let challengeStats = {
            solvedChallenges: 0,
            solvedEasyChallenges: 0,
            solvedMediumChallenges: 0,
            solvedHardChallenges: 0,
            totalEasyChallenges: 0,
            totalMediumChallenges: 0,
            totalHardChallenges: 0,
            totalChallenges: 0 // Added totalChallenges counter
        };

        challengeStats = challenges.reduce((stats, challenge) => {
            const { difficulty, url } = challenge;

            stats.totalChallenges++; // Increment totalChallenges for each challenge
            stats[`total${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}Challenges`]++;

            if (userChallenges[url]) {
                stats.solvedChallenges++;
                stats[`solved${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}Challenges`]++;
            }

            return stats;
        }, challengeStats);

        const ranking = calculateRanking(usersData, Object.keys(userChallenges).length, currentUserData.userID);

        return { ...challengeStats, ranking };
    };


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

    const rateChallenge = useCallback(async (value, challenge, user) => {
        await db
            .collection('challenges')
            .doc(challenge)
            .update({
                [`ratings.${user}`]: value,
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
    }, []);

    const addChallenge = useCallback(async (userID, title, description, difficulty, correctAnswer, image) => {
        try {
            let imageUrl = null;

            if (image && image.type) {
                let filetype = image.type.slice(6);
                let filename = cryptoRandomString({length: 28, type: 'alphanumeric'});
                let fullFilename = `${filename}.${filetype}`;

                let metadata = {
                    contentType: image.type,
                };

                let uploadTask = storageRef.child('challenges/' + fullFilename).put(image, metadata);

                imageUrl = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Logika postępu przesyłania
                            // Bez tego rzuca błąd
                        },
                        (error) => {
                            console.error('Error uploading file: ', error);
                            reject(error);
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                resolve(downloadURL);
                            }).catch((error) => {
                                console.error('Error getting download URL: ', error);
                                reject(error);
                            });
                        }
                    );
                });
            }

            const points = calculatePoints(difficulty);
            const url = generateUrlFromTitle(title);
            const createdAt = new Date();

            await db.collection('challenges').doc(`${url}`).set({
                description: description,
                difficulty: difficulty,
                key: correctAnswer,
                points: points,
                title: title,
                image: imageUrl ? imageUrl : null,
                fileName: image?.name || null,
                completedBy: 0,
                ratings: {},
                url: url,
                userID: userID,
                createdAt: createdAt
            });

            return url;
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    }, [storageRef, db]);

    const updateChallenge = useCallback(async (challengeID, {title, description, difficulty, correctAnswer, image}) => {
        try {
            let imageUrl = null;

            if (image && image.type) {
                let filetype = image.type.slice(6);
                let filename = cryptoRandomString({length: 28, type: 'alphanumeric'});
                let fullFilename = `${filename}.${filetype}`;

                let metadata = {
                    contentType: image.type,
                };

                let uploadTask = storageRef.child('challenges/' + fullFilename).put(image, metadata);

                imageUrl = await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Logika postępu przesyłania
                            // Bez tego rzuca błąd
                        },
                        (error) => {
                            console.error('Error uploading file: ', error);
                            reject(error);
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                console.log('File available at', downloadURL);
                                resolve(downloadURL);
                            }).catch((error) => {
                                console.error('Error getting download URL: ', error);
                                reject(error);
                            });
                        }
                    );
                });
            }

            const points = calculatePoints(difficulty);

            const updateData = {
                description: description,
                difficulty: difficulty,
                key: correctAnswer,
                points: points,
                title: title,
                image: imageUrl ? imageUrl : null,
                fileName: image?.name || null
                // updatedAt: new Date(), // aktualizujemy?
            };

            await db.collection('challenges').doc(challengeID).update(updateData);
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    }, [storageRef, db]);

    const deleteChallenge = useCallback(async (challengeURL) => {
        try {
            // Usuwanie dokumentu z kolekcji 'challenges' na podstawie URL
            await db.collection('challenges').doc(challengeURL).delete();
            console.log(`Challenge with URL '${challengeURL}' has been deleted.`);
        } catch (error) {
            console.error('Error deleting challenge: ', error);
        }
    }, [db]);

    const calculatePoints = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 5;
            case 'medium':
                return 10;
            case 'hard':
                return 15;
            default:
                return 0;
        }
    };

    const generateUrlFromTitle = (title) => {
        return title.toLowerCase().split(' ').join('-').replace(/[^a-z0-9\-]/g, '');
    };


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (
            window.matchMedia('(prefers-color-scheme: dark)') &&
            localStorage.getItem('darkMode') !== 'false' &&
            localStorage.getItem('darkMode') !== 'true'
        ) {
            localStorage.setItem('darkMode', 'true');
            setDarkMode('true');
        } else if (
            window.matchMedia('(prefers-color-scheme: light)') &&
            localStorage.getItem('darkMode') !== 'false' &&
            localStorage.getItem('darkMode') !== 'true'
        ) {
            localStorage.setItem('darkMode', 'false');
            setDarkMode('false');
        }
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
            darkMode,
            switchDarkMode,
            rateChallenge,
            addChallenge,
            updateChallenge,
            deleteChallenge,
            challengeStats,
            getChallengeStats
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
            darkMode,
            switchDarkMode,
            rateChallenge,
            addChallenge,
            updateChallenge,
            deleteChallenge,
            challengeStats,
            getChallengeStats
        ]
    );

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export {useAuth, AuthProvider};
