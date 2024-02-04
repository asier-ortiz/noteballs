import {defineStore} from 'pinia';
import {collection, onSnapshot, doc, deleteDoc, updateDoc, query, orderBy, addDoc} from "firebase/firestore";
import {db} from '@/js/firebase';
import {useStoreAuth} from "@/stores/storeAuth";

let notesCollectionRef;
let notesCollectionQuery;
let getNotesSnapshot = null;

export const useStoreNotes = defineStore('storeNotes', {

    state: () => {
        return {
            notes: [],
            notesLoaded: false,
        };
    },

    actions: {

        init() {
            const storeAuth = useStoreAuth();
            notesCollectionRef = collection(db, 'users', storeAuth.user.id, 'notes');
            notesCollectionQuery = query(notesCollectionRef, orderBy("date", "desc"));
            this.getNotes();
        },

        async getNotes() {
            this.notesLoaded = false;
            getNotesSnapshot = onSnapshot(notesCollectionQuery, (querySnapshot) => {
                let notes = [];
                querySnapshot.forEach((doc) => {
                    let note = {
                        id: doc.id,
                        content: doc.data().content,
                        date: doc.data().date
                    };
                    notes.push(note);
                });
                this.notes = notes;
                this.notesLoaded = true;
            }, error => {
                console.log('error message: ', error.message);
            });
        },

        clearNotes() {
            if (getNotesSnapshot) getNotesSnapshot(); // unsubscribe from any active listener
            this.notes = [];
        },

        async addNote(newNoteContent) {
            let currentDate = new Date().getTime(),
                date = currentDate.toString();

            await addDoc(notesCollectionRef, {
                content: newNoteContent,
                date: date
            });

        },

        async deleteNote(idToDelete) {
            await deleteDoc(doc(notesCollectionRef, idToDelete));
        },

        async updateNote(id, content) {
            const ref = doc(notesCollectionRef, id);
            await updateDoc(ref, {content});
        }

    },

    getters: {

        getNoteContent: (state) => {
            return id => state.notes.filter(note => note.id === id)[0].content;
        },

        totalNotesCount: (state) => {
            return state.notes.length;
        },

        totalCharactersCount: (state) => {
            return state.notes.reduce((acc, cur) => acc + cur.content.length, 0);
        }

    }

});
