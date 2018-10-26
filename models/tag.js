'use strict';

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
});

tagSchema.set('timestamps', true);

const config = {
    virtuals: true,   
    transform: (doc, result) => {
      result.id = doc._id;
      delete result._id;
      delete result.__v;
    }
  };

tagSchema.set('toObject', config);
tagSchema.set('toJSON', config);

module.exports = mongoose.model('Tag', tagSchema);