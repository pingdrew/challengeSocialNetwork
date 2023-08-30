const { Thought, User } = require('../models');
// Require our thought and user models

module.exports = {
  // GET all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single thought by id
  async getSingleThought(req, res){
    try{
        const thought = await Thought.findOne({_id: req.params.thoughtId});
        if(!thought){
            return res.status(404).json({ message: 'No thought with that ID!' });
        }

        res.status(200).json(thought);
    }catch(err){
        res.status(500).json(err);
    }
},


// CREATE thought 
async createThought(req, res){
    try{
        const thought = await Thought.create(req.body);

        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id }},
            { new: true }
        );

        if(!user){
            return res.status(404).json({ message: 'Thought created, but found no user with that ID' });
        }

        res.status(200).json(`Created the thought: ${thought}`);
    }catch(err){
        res.status(500).json(err);
    }
},

// UPDATE a thought 
async updateThought(req, res){
    try{
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if(!thought){
            res.status(404).json({ message: 'No thought with this id!' });
        }
        res.status(200).json(thought);
    }catch(err){
        res.status(500).json(err);
    }
},

// DELETE thought with id
async deleteThought(req,res){
    try{
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

        if(!thought){
            return res.status(404).json({ message: 'No thought with this ID!' });
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if(!user){
            return res.status(404).json({ message: 'Thought deleted but no user with this id!' });
        }

        res.status(200).json(`Thought successfully deleted: ${thought}`);
    }catch(err){
        res.status(500).json(err);
    }
},

// CREATE reaction using params
async createReaction(req, res){
    try{
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        );

        if(!reaction){
            return res.status(404).json({ message: 'No thought with this id!' }); 
        }

        res.status(200).json(reaction);
    }catch(err){
        res.status(500).json(err);
    }
},

  // DELETE reaction with id
  async deleteReaction(req,res){
    try{
        const reaction = await Thought.findOneAndRemove(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }
        )

        if(!reaction){
            return res.status(404).json({ message: 'No thought with this ID!' });
        }

        res.status(200).json(reaction);
    }catch(err){
        res.status(500).json(err);
    }
}
};
