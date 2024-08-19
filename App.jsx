// Import
import './App.css';


import React from "react"
import Sidebar from "./components/Sidebar.jsx"
import Editor from "./components/Editor.jsx"

import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(  
       () => JSON.parse(localStorage.getItem("notes")) ||[]
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) || ""
    )

    const currentNote =  
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
        // console.log(notes[0].body.split("\n"))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {

        // Try to rearrange the most recently-modified 
        // not to be at the top
        setNotes(oldNotes => {
            const newArray = []
            for(let i=0; i<oldNotes.length; i++){
                const oldNote = oldNotes[i];
                if(oldNote.id === currentNoteId){
                    newArray.unshift({ ...oldNote, body: text })
                }else{
                    newArray.push(oldNote)
                }
            }

            return newArray
            //Create a new empty array
            //Loop over the original array
                //If the id matches 
                    //Put the updated note at the
                    //beginning of the new array
                //else
                    //push the old note to the end
                    //of the new array
                //return the new array
        })

        // This does not rearrange the notes
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))

    }

    function deleteNote(event,noteId){
        event.stopPropagation()
        setNotes(oldNotes => oldNotes.filter( note => note.id !== noteId ))
    }
    
    
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}



