'use strict';

const express = require('express');
const { Note } = require("../models/note");
const router = express.Router();


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const filters = {};
  const queriableFields = ['title', 'content'];
  queriableFields.forEach(field => {
    if(req.query[field]){
      filters[field] = req.query[field];
    }
  });
  return Note
    .find(filters)
    .then(results => {
      if(results) {
        res.json(results);
      }else{
        next();
      }
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

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;