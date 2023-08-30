const router = require('express').Router();
const {
  getThoughts,
  createThought,
  getSingleThought,
  updateThought,
  deleteReaction,
  createReaction,
  deleteThought
} = require('../../controllers/thoughtController');

// /api/thoughts
router
  .route('/')
  // GET all thoughts
  .get(getThoughts)
  // POST a new thought
  // push the created thought's _id to the associated user's thoughts array field
  .post(createThought);

// /api/thoughts/thoughtsId
router
  .route('/:thoughtId')
  // GET to get a single thought by its _id
  .get(getSingleThought)
  // PUT to update a thought by its _id
  .put(updateThought)
  // DELETE to remove thought by its _id
  .delete(deleteThought);
  
// /api/thoughts/:thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  // POST to create a reaction stored in a single thought's reactions array field
  .post(createReaction)

// /api/thoughts/:thoughtId/reactions/:reactionId
router
  .route('/:thoughtId/reactions/:reactionId')
  // DELETE to pull and remove a reaction by the reaction's reactionId value
  .delete(deleteReaction);

module.exports = router;