import {defineStore} from 'pinia';
import {auth} from "@/js/firebase";
import {createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {useStoreNotes} from "@/stores/storeNotes";

export const useStoreAuth = defineStore('storeAuth', {

    state: () => {
        return {
            user: {},
        };
    },

    actions: {

        init() {
            const storeNotes = useStoreNotes();

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user.id = user.uid;
                    this.user.email = user.email;
                    this.router.push('/');
                    storeNotes.init();
                } else {
                    this.user = {};
                    // Replace removes user's browser history, so they can't go back
                    this.router.replace('/auth');
                    storeNotes.clearNotes();
                }
            });
        },

        registerUser(credentials) {
            createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    // console.log('user: ', user);
                })
                .catch((error) => {
                    console.log('error.message: ', error.message);
                    console.log('error.code: ', error.code);
                });
        },

        loginUser(credentials) {
            signInWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    // console.log('user: ', user);
                })
                .catch((error) => {
                    console.log('error.message: ', error.message);
                    console.log('error.code: ', error.code);
                });
        },

        logoutUser() {
            signOut(auth).then(() => {
                // console.log('User signed out');
            }).catch((error) => {
                console.log('error.message: ', error.message);
            });
        },

    },

});