'use strict';

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String
});

// Add `createdAt` and `updatedAt` fields
noteSchema.set('timestamps', true);

const config = {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    // result.id = doc._id;
    delete result._id;
    delete result.__v;
  }
};

// Customize output for `res.json(data)`, `console.log(data)` etc.
noteSchema.set('toObject', config);
noteSchema.set('toJSON', config);

module.exports = mongoose.model('Note', noteSchema);
