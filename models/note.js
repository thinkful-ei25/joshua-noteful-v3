const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: String
});


noteSchema.set('timestamps', true);
const Note = mongoose.model('Note', noteSchema);
module.exports = { Note };