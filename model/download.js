const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true
  }
});

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
