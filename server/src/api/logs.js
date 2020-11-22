const {
  Router,
} = require('express');
const fs = require('fs');
const multer = require('multer');
const LogEntry = require('../models/LogEntry');

const upload = multer({
  dest: '../client/public/uploads/',
});

const imageFields = [
  { name: 'uploadPano' },
  { name: 'uploadHotSpotImage0' },
  { name: 'uploadHotSpotImage1' },
  { name: 'uploadHotSpotImage2' },
  { name: 'uploadHotSpotImage3' },
  { name: 'uploadHotSpotImage4' },
];

const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end(err);
};
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.fields(imageFields), async (req, res, next) => {
  const hotSpots = [
    req.files.uploadHotSpotImage0,
    req.files.uploadHotSpotImage1,
    req.files.uploadHotSpotImage2,
    req.files.uploadHotSpotImage3,
    req.files.uploadHotSpotImage4,
  ];
  const dateCreated = Date.now();
  const panoTempPath = `${req.files.uploadPano[0].destination}${req.files.uploadPano[0].filename}`;
  const panoTargetPath = `../client/public/uploads/${dateCreated}/${req.files.uploadPano[0].originalname}`;
  const hotSpotsObject = [];

  fs.mkdir(`../client/public/uploads/${dateCreated}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      fs.rename(panoTempPath, panoTargetPath, (err) => {
        if (err) return handleError(err.message, res);
      });

      hotSpots.forEach((hotspot, i) => {
        if (hotspot !== undefined) {
          const hotSpotTempPath = `${hotSpots[i][0].destination}${hotSpots[i][0].filename}`;
          const hotSpotTargetPath = `../client/public/uploads/${dateCreated}/${hotSpots[i][0].originalname}`;

          hotSpotsObject.push({
            imagePath: hotSpotTargetPath,
            name: req.body['name' + i],
            parentFolder: dateCreated,
            pitch: req.body['pitch' + i],
            yaw: req.body['yaw' + i],
          });

          fs.rename(hotSpotTempPath, hotSpotTargetPath, (err) => {
            if (err) return handleError(err, res);
          });
        }
      });
    }
  });

  console.log(req.body);
  
  const hot = [
    {
      imagePath: 'https//codbinar.com/icons/react.svg',
      name: 'Name 1',
      parentFolder: dateCreated,
      pitch: 65,
      yaw: 18,
    },
    {
      imagePath: 'https://codbinar.com/icons/java.svg',
      name: 'Name 2',
      parentFolder: dateCreated,
      pitch: 5,
      yaw: 29,
    },
  ];

  const trip = {
    exif: {
      aperture: req.body.aperture,
      dateCreated: req.body.ateCreated,
      deviceBrand: req.body.deviceBrand,
      deviceModel: req.body.deviceModel,
      exposureTime: req.body.exposureTime,
      fNumber: req.body.fNumber,
      focalLength: req.body.focalLength,
      height: req.body.height,
      iso: req.body.iso,
      shutterSpeed: req.body.shutterSpeed,
      width: req.body.width,
    },
    location: {
      address: req.body.address,
      altitude: req.body.altitude,
      city: req.body.city,
      country: req.body.country,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      postcode: req.body.postcode,
      region: req.body.region,
    },
    panorama: {
      hfov: req.body.hfov,
      hotSpots: hot,
      maxHfov: req.body.maxHfov,
      maxPitch: req.body.maxPitch,
      maxYaw: req.body.maxYaw,
      minHfov: req.body.minHfov,
      minPitch: req.body.minPitch,
      minYaw: req.body.minYaw,
      pitch: req.body.pitch,
      yaw: req.body.yaw,
    },
    post: {
      description: req.body.description,
      fileName: req.files.uploadPano[0].originalname,
      imagePath: panoTargetPath,
      parentFolder: dateCreated,
      title: req.body.title,
    },
  };
  console.log(trip);

  try {
    const logEntry = new LogEntry(trip);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    console.log(req.body);
    next(error);
  }
});

module.exports = router;