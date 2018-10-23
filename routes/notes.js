'use strict';

const express = require('express');
const { Note } = require("../models/note");
const router = express.Router();


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  let query = {};
  if(req.query.searchTerm){
    query = {$or:[{title:{$regex: req.query.searchTerm, $options: 'i'}},{content:{$regex: req.query.searchTerm, $options: 'i'}}]}
  }  
  Note
    .find(query)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    })
  });

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  return Note
    .findById(req.params.id)
    .then( results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    })

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const requiredFields = ['type'];
  for(let i = 0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing ${field} in response body`;
      console.error(message);
      return res.status(400).send(message)
    }
  }
  Note.create({
    title: req.body.title,
    content: req.body.content
  })
    .then(note => res.status(201).json(note))
    .catch(err => {
      next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toUpdate = {};
  const updateableFields = ['title', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Note
    .findByIdAndUpdate(req.params.id, { $set: toUpdate})
    .then( () => res.status(204).end())
    .catch(err => {
      next(err)
    })

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
      next(err)
    })
});

module.exports = router;