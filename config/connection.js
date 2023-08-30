const { connect, connection } = require('mongoose');

connect('mongodb+srv://root:root@pingdrew.tokr7ac.mongodb.net/developersApplications');

module.exports = connection;
