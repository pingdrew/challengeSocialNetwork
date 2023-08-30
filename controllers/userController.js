const { User, Thought } = require('../models');

module.exports = {
  // GET all users
  async getUsers(req, res) {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
},
  // GET a single user
  async getSingleUser(req, res) {
    try{
        const user = await User.findOne({ _id: req.params.userId }).select('-__v')

        if(!user){
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
},

// UPDATE a user
async updateUser(req, res){
  try{
      const userUpdate = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { username: req.body.username, email: req.body.email },
          {new: true}
      );
      res.status(200).json(userUpdate); 
  }catch(err){
      res.status(500).json(err);
  }
},

  // CREATE a new user
  async createUser(req, res) {
    try{
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);
    }catch(err){
        res.status(500).json(err);
    }
},
  // DELETE a user and associated apps
async deleteUser(req, res) {
  try{
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if(!user){
          return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({
          _id: { $in: user.thoughts }
      }); 

      res.status(200).json({message: 'User and thoughts deleted!'});
  }catch(err){
      res.status(500).json(err);
  }
},

 // PUT friend in User's list of friends
 async addFriend(req,res){
  try{
      const friend = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } },
          {runValidators: true, new: true}
      );

      if(!friend){
          return res.status(404).json({ message: 'No user with this ID!' });
      }

      res.status(200).json(friend); 
  }catch(err){
      res.status(500).json(err);
  }
},

// DELETE friend from user's friend list
async deleteFriend(req,res){
  try{
      const user = await User.findOneAndUpdate(
          {_id: req.params.userId },
          { $pull: { friends: req.params.friendId}},
          {new: true}
      );

      if(!user){
          return res.status(404).json({ message: 'No user with this ID!'});
      }

      res.status(200).json(user);
  }catch(err){
      res.status(500).json(err);
  }
}
}
