const { Application, User } = require('../models');

module.exports = {
  async getApplications(req, res) {
    try {
      const applications = await Application.find();
      res.json(applications);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleApplication(req, res) {
    try {
      const application = await Application.findOne({ _id: req.params.applicationId });

      if (!application) {
        return res.status(404).json({ message: 'No application with that ID' });
      }

      res.json(application);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the createApplication method
  async createApplication(req, res) {
    try {
      const application = await Application.create(req.body);
      // uses newly created application to append the id to the users applications array
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { applications: application._id } },
        { new: true }
      );

      if (!user) {
        // if there is no user when application is created, create application and tell us there aint a user
        return res.status(404).json({
          message: 'Application created, but found no user with that ID',
        })
      }

      res.json('Created the application 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the updateApplication method
  async updateApplication(req, res) {
    try {
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!application) {
        return res.status(404).json({ message: 'No application with this id!' });
      }

      res.json(application);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the deleteApplication method
  async deleteApplication(req, res) {
    try {
      const application = await Application.findOneAndRemove({ _id: req.params.applicationId });
      // get the application by id from the parameters in the request, if there is none then stop the code
      if (!application) {
        return res.status(404).json({ message: 'No application with this id!' });
      }

      // find the user that wanted to delete the application, and pull the app out from their array, effectively deleting it
      const user = await User.findOneAndUpdate(
        { applications: req.params.applicationId },
        { $pull: { applications: req.params.applicationId } },
        { new: true }
      );
      
      // if no user, tell us there aint a user
      if (!user) {
        return res.status(404).json({
          message: 'Application deleted but no user with this id!',
        });
      }

      res.json({ message: 'Application successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // TODO: Add comments to the functionality of the addTag method
  async addTag(req, res) {
    try {
      // add a tag to the array of tags for the application in the request body
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $addToSet: { tags: req.body } },
        { runValidators: true, new: true }
      );

      // if there is no application found, stop code
      if (!application) {
        return res.status(404).json({ message: 'No application with this id!' });
      }

      // otherwise go through with order 66
      res.json(application);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // TODO: Add comments to the functionality of the addTag method
  async removeTag(req, res) {
    try {
      // find the application housing said tag that the user wants to delete, and pull the tag from the array
      const application = await Application.findOneAndUpdate(
        { _id: req.params.applicationId },
        { $pull: { tags: { tagId: req.params.tagId } } },
        { runValidators: true, new: true }
      );

      // if there is no tag, then stop code
      if (!application) {
        return res.status(404).json({ message: 'No application with this id!' });
      }

      // otherwise commence order 66
      res.json(application);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
