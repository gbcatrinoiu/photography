const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const requiredNumber = {
  type: Number,
  required: true,
};

const logEntrySchema = new Schema({
  exif: {
    aperture: Number,
    dateCreated: String,
    deviceBrand: String,
    deviceModel: String,
    exposureTime: Number,
    fNumber: Number,
    focalLength: Number,
    height: Number,
    iso: Number,
    shutterSpeed: Number,
    width: Number,
  },
  location: {
    address: String,
    altitude: Number,
    city: String,
    country: String,
    latitude: {
      ...requiredNumber,
      min: -90,
      max: 90,
    },
    longitude: {
      ...requiredNumber,
      min: -90,
      max: 90,
    },
    postcode: String,
    region: String,
  },
  panorama: {
    hfov: Number,
    hotSpots: [{
      imagePath: String,
      name: String,
      parentFolder: String,
      pitch: String,
      yaw: String,
    }],
    maxHfov: Number,
    maxPitch: Number,
    maxYaw: Number,
    minHfov: Number,
    minPitch: Number,
    minYaw: Number,
    pitch: Number,
    yaw: Number,
  },
  post: {
    description: String,
    fileName: String,
    imagePath: String,
    parentFolder: String,
    title: String,
  },
}, {
  timestamps: true,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;