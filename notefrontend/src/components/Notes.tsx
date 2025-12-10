import React, { useEffect, useState } from 'react'
import { NoteType } from "../types"
import axios from "axios"
import API from "../axios/axios"

export default function Notes() {

    const [notes, setNotes] = useState<NoteType[]>([]);
    const [form, setForm] = useState<NoteType>({ title: "", content: "" });
    const [editId, setEditedId] = useState<string | null>(null);

    const loadnotes = async () => {
        const res = await axios.get(API)
        console.log("Notes loaded:", res.data);
        setNotes(res.data)
    };

    useEffect(() => {
        loadnotes();
    }, []);

    const handlesubmit = async () => {
        if (!editId) {
            await axios.post(API, form)
        } else {
            await axios.put(`${API}/${editId}`, form)
            setEditedId(null)
        }

        setForm({ title: "", content: "" })
        loadnotes()
    };

    const deleteNotes = async (id: string) => {
        console.log("Deleting note with ID:", id);
        await axios.delete(`${API}/${id}`);
        loadnotes();
    }

    const StartEdit = (note: NoteType) => {
        console.log("Editing note:", note);
        setForm({ title: note.title, content: note.content });
        setEditedId(note._id || null)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">

                <h1 className="text-2xl font-bold text-center mb-5">
                    {editId ? "Edit Note" : "Create New Note"}
                </h1>

                <input
                    type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 border rounded-lg mb-3 
                               focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <textarea
                    placeholder="Write your content here..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full p-3 border rounded-lg mb-4 h-28 resize-none 
                               focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={handlesubmit}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg 
                               hover:bg-blue-600 transition font-semibold"
                >
                    {editId ? "Update Note" : "Add Note"}
                </button>

                <hr className="my-6" />

                <h2 className="text-xl font-semibold mb-3">Your Notes</h2>

                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note._id}
                            className="p-4 border bg-gray-50 rounded-lg shadow-sm"
                        >
                            <h3 className="text-lg font-semibold">{note.title}</h3>
                            <p className="text-gray-700 mb-3">{note.content}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => StartEdit(note)}
                                    className="px-4 py-2 bg-yellow-400 rounded-lg 
                                               hover:bg-yellow-500 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteNotes(note._id!)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg 
                                               hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
