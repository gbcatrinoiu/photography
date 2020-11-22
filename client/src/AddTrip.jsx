import React from 'react';
import EXIF from "exif-js";
import { createLogEntry } from './API';
import { Pannellum } from 'pannellum-react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ReactFancyBox from 'react-fancybox';
import 'bootstrap/dist/css/bootstrap.min.css';

interface MyProps {
  onClose: () => void,
}

interface MyState {
  addHotSpot: {
    hotSpotName: string,
    hotSpotPitch: number,
    hotSpotYaw: number,
  },
  exif: {
    aperture: number,
    dateCreated: string,
    deviceBrand: string,
    deviceModel: string,
    exposureTime: number,
    fNumber: number,
    focalLength: number,
    height: number,
    iso: number,
    shutterSpeed: number,
    width: number,
  },
  location: {
    address: string,
    altitude: number,
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    postcode: string,
    region: string,
  },
  panorama: {
    hfov: number,
    hotSpots?:
    {
      image: object,
      localUrl: string,
      name: string,
      pitch: number,
      url: string,
      yaw: number,
    }[],
    maxHfov: number,
    maxPitch: number,
    maxYaw: number,
    minHfov: number,
    minPitch: number,
    minYaw: number,
    pitch: number,
    yaw: number,
  },
  post: {
    description: string,
    fileName: string,
    image: object,
    localUrl: string,
    title: string,
    url: string,
  },
}

class AddTrip extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props);

    this.state = {
      addHotSpot: {
        hotSpotName: '',
        hotSpotPitch: 0,
        hotSpotYaw: 0,
      },
      exif: {
        aperture: undefined,
        dateCreated: '',
        deviceBrand: '',
        deviceModel: '',
        exposureTime: undefined,
        fNumber: undefined,
        focalLength: undefined,
        height: undefined,
        iso: undefined,
        shutterSpeed: undefined,
        width: undefined,
      },
      location: {
        address: '',
        altitude: undefined,
        city: '',
        country: '',
        latitude: undefined,
        longitude: undefined,
        postcode: '',
        region: '',
      },
      panorama: {
        hfov: 100,
        hotSpots: [],
        maxHfov: 150,
        maxPitch: 90,
        maxYaw: 180,
        minHfov: 50,
        minPitch: -90,
        minYaw: -180,
        pitch: 0,
        yaw: 0,
      },
      post: {
        description: '',
        fileName: '',
        image: null,
        localUrl: '',
        title: 'Add a new trip',
        url: '',
      },
    }

    this.uploadPano = this.uploadPano.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleHotSpot = this.handleHotSpot.bind(this);
    this.createHotSpot = this.createHotSpot.bind(this);
    this.handlePanoramaSettings = this.handlePanoramaSettings.bind(this);
    this.myRef = React.createRef();
  }

  setExif(pano) {
    const localUrl = URL.createObjectURL(pano);

    const getAltitude = pano.exifdata.GPSAltitude ? pano.exifdata.GPSAltitude.numerator / pano.exifdata.GPSAltitude.denominator : undefined;
    const getLatitude = pano.exifdata.GPSLatitude ? pano.exifdata.GPSLatitude[0].numerator + pano.exifdata.GPSLatitude[1].numerator / pano.exifdata.GPSLatitude[1].denominator / 60 + pano.exifdata.GPSLatitude[2].numerator / pano.exifdata.GPSLatitude[2].denominator / 3600 : undefined;
    const getLongitude = pano.exifdata.GPSLongitude ? pano.exifdata.GPSLongitude[0].numerator + pano.exifdata.GPSLongitude[1].numerator / pano.exifdata.GPSLongitude[1].denominator / 60 + pano.exifdata.GPSLongitude[2].numerator / pano.exifdata.GPSLongitude[2].denominator / 3600 : undefined;

    // eslint-disable-next-line
    const reverseGeocoding = getLatitude && getLongitude
      ? fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${getLongitude},${getLatitude}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
        .then(response => response.json())
        .then((pano) => (
          this.setState({
            ...this.state,
            location: {
              ...this.state.location,
              address: pano.features[pano.features.length - 5] ? pano.features[pano.features.length - 5].place_name : '',
              city: pano.features[pano.features.length - 3] ? pano.features[pano.features.length - 3].place_name : '',
              country: pano.features[pano.features.length - 1] ? pano.features[pano.features.length - 1].place_name : '',
              postcode: pano.features[pano.features.length - 4] ? pano.features[pano.features.length - 4].place_name : '',
              region: pano.features[pano.features.length - 2] ? pano.features[pano.features.length - 2].place_name : '',
            },
          })
        ))
      : null;

    this.setState({
      ...this.state,
      exif: {
        ...this.state.exif,
        aperture: pano.exifdata.ApertureValue ? pano.exifdata.ApertureValue.numerator / pano.exifdata.ApertureValue.denominator : undefined,
        dateCreated: pano.exifdata.DateTime ? pano.exifdata.DateTime : '',
        deviceBrand: pano.exifdata.Make ? pano.exifdata.Make : '',
        deviceModel: pano.exifdata.Model ? pano.exifdata.Model : '',
        exposureTime: pano.exifdata.ExposureTime ? pano.exifdata.ExposureTime.numerator / pano.exifdata.ExposureTime.denominator : undefined,
        fNumber: pano.exifdata.FNumber ? pano.exifdata.FNumber.numerator / pano.exifdata.FNumber.denominator : undefined,
        focalLength: pano.exifdata.FocalLength ? pano.exifdata.FocalLength.numerator / pano.exifdata.FocalLength.denominator : undefined,
        height: pano.exifdata.PixelYDimension ? pano.exifdata.PixelYDimension : undefined,
        iso: pano.exifdata.ISOSpeedRatings ? pano.exifdata.ISOSpeedRatings : undefined,
        shutterSpeed: pano.exifdata.ShutterSpeedValue ? pano.exifdata.ShutterSpeedValue : undefined,
        width: pano.exifdata.PixelXDimension ? pano.exifdata.PixelXDimension : undefined,
      },
      location: {
        ...this.state.location,
        altitude: pano.exifdata.GPSAltitude ? getAltitude : undefined,
        latitude: pano.exifdata.GPSLatitude ? getLatitude : undefined,
        longitude: pano.exifdata.GPSLongitude ? getLongitude : undefined,
      },
      post: {
        ...this.state.post,
        fileName: pano.name,
        image: pano,
        localUrl: localUrl,
        url: `http://localhost:3000/uploads/${pano.name}`,
      },
    });
  }

  uploadPano(event) {
    const pano = event.target.files[0];
    return EXIF.getData(pano, () => this.setExif(pano));
  }

  selectHotSpotImage(event, index) {
    const hotSpotImage = event.target.files[0];

    let hotSpots = [...this.state.panorama.hotSpots];
    hotSpots[index].image = event.target.files[0];
    hotSpots[index].localUrl = URL.createObjectURL(hotSpotImage);
    hotSpots[index].url = `http://localhost:3000/uploads/${hotSpotImage.name}`;

    this.setState({
      ...this.state,
      panorama: {
        ...this.state.panorama,
        hotSpots: hotSpots,
      }
    })
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      [event.target.alt]: {
        ...this.state.[event.target.alt],
        [event.target.name]: event.target.value,
      }
    })
  }

  handleHotSpot(event) {
    this.setState({
      ...this.state,
      addHotSpot: {
        ...this.state.addHotSpot,
        [event.target.name]: event.target.name === 'hotSpotName' ? event.target.value : parseInt(event.target.value, 10),
      },
    });
  }

  handlePanoramaSettings(event) {
    this.setState({
      ...this.state,
      panorama: {
        ...this.state.panorama,
        [event.target.name]: parseInt(event.target.value, 10),
      }
    })
  }

  createHotSpot(event) {
    event.preventDefault();
    const newHotSpot = {
      pitch: this.state.addHotSpot.hotSpotPitch,
      yaw: this.state.addHotSpot.hotSpotYaw,
      name: this.state.addHotSpot.hotSpotName,
      image: null,
      url: null,
      localUrl: null,
    };
    if (this.state.addHotSpot.hotSpotPitch && this.state.addHotSpot.hotSpotYaw && this.state.addHotSpot.hotSpotName) {

      this.setState({
        ...this.state,
        addHotSpot: {
          hotSpotYaw: 0,
          hotSpotPitch: 0,
          hotSpotName: '',
        },
        panorama: {
          ...this.state.panorama,
          hotSpots: [
            ...this.state.panorama.hotSpots,
            newHotSpot,
          ],
        },
      });
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const data = {
      exif: {
        aperture: this.state.exif.aperture,
        dateCreated: this.state.exif.dateCreated,
        deviceBrand: this.state.exif.deviceBrand,
        deviceModel: this.state.exif.deviceModel,
        exposureTime: this.state.exif.exposureTime,
        fNumber: this.state.exif.fNumber,
        focalLength: this.state.exif.focalLength,
        height: this.state.exif.height,
        iso: this.state.exif.iso,
        shutterSpeed: this.state.exif.shutterSpeed,
        width: this.state.exif.width,
      },
      location: {
        address: this.state.location.address,
        altitude: this.state.location.altitude,
        city: this.state.location.city,
        country: this.state.location.country,
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,
        postcode: this.state.location.postcode,
        region: this.state.location.region,
      },
      panorama: {
        hfov: this.state.panorama.hfov,
        // hotSpots: this.state.panorama.hotSpots,
        maxHfov: this.state.panorama.maxHfov,
        maxPitch: this.state.panorama.maxPitch,
        maxYaw: this.state.panorama.maxYaw,
        minHfov: this.state.panorama.minHfov,
        minPitch: this.state.panorama.minPitch,
        minYaw: this.state.panorama.minYaw,
        pitch: this.state.panorama.pitch,
        yaw: this.state.panorama.yaw,
      },
      post: {
        description: this.state.post.description,
        fileName: this.state.post.fileName,
        // image: this.state.post.image,
        title: this.state.post.title,
        url: this.state.post.url,
      },
    }
    console.log(data);

    try {
      // eslint-disable-next-line
      const created = createLogEntry(data);
      this.props.onClose();
    }
    catch (error) {
      console.log(error);
    }
  }

  addHotSpot = (index, image) => {
    const getHotSpot = document.getElementsByClassName(`hotSpot-${index}`);

    const hotSpotContainer = document.createElement('div');
    hotSpotContainer.className = 'hotSpot-container';
    hotSpotContainer.innerHTML = '<a id="single_image" href="' + image.props.src + '"><img src="' + image.props.src + '" alt="" /></a>';

    const fancyBox = React.createElement(
      ReactFancyBox,
      {
        thumbnail: "https://loremflickr.com/320/240",
        image: "https://www.w3schools.com/howto/img_forest.jpg"
      },
      'asd'
    )
    getHotSpot[0].appendChild(fancyBox);
  }

  removeHotSpot = (index) => {
    const hotSpots = this.state.panorama.hotSpots;
    hotSpots.splice(index, 1);
    console.log(hotSpots);
  }

  render() {
    return (
      <div className='trip'>
        {this.state.post.url
          ? <Pannellum
            width="100vw"
            height="100vh"
            compass={true}
            image={this.state.post.localUrl}
            hfov={this.state.panorama.hfov}
            maxHfov={this.state.panorama.maxHfov}
            maxPitch={this.state.panorama.maxPitch}
            maxYaw={this.state.panorama.maxYaw}
            minHfov={this.state.panorama.minHfov}
            minPitch={this.state.panorama.minPitch}
            minYaw={this.state.panorama.minYaw}
            pitch={this.state.panorama.pitch}
            yaw={this.state.panorama.yaw}
            autoLoad={true}
            hotspotDebug={true}
            showControls={false}
            orientationOnByDefault={true}
            ref={this.myRef}
            onMousedown={(event) => this.setState({
              ...this.state,
              addHotSpot: {
                ...this.state.addHotSpot,
                hotSpotYaw: this.myRef.current.getViewer().mouseEventToCoords(event)[1],
                hotSpotPitch: this.myRef.current.getViewer().mouseEventToCoords(event)[0]
              }
            })}
            autoRotate={0}
          >

            {this.state.panorama.hotSpots
              ? this.state.panorama.hotSpots.map((hotSpot, index) => (
                <Pannellum.Hotspot
                  key={index}
                  type="custom"
                  pitch={hotSpot.pitch}
                  yaw={hotSpot.yaw}
                  name={hotSpot.name}
                  cssClass={`hotSpot-${index}`}
                  tooltip={(evt, args) => (this.addHotSpot(index, args))}
                  tooltipArg={<img src={hotSpot.localUrl} alt={hotSpot.name} />}
                />
              ))
              : null}

          </Pannellum>
          : null}
        <div className='trip-popup'>
          <form method='post' encType='multipart/form-data' action='http://localhost:1337/api/logs'>
            <div className='header'>
              <h2>{this.state.post.title}</h2>
              <hr />
              <h3><strong>{this.state.location.country}</strong> {this.state.location.city}</h3>
              <p>{this.state.post.description}</p>
            </div>

            <div className='body' id='caras'>
              {this.state.post.url
                ? <Tabs defaultActiveKey="post" id="uncontrolled-tab-example">
                  <Tab eventKey="post" title="Post">
                    <div className='w-100'>
                      <label htmlFor='title'>title<span>*</span></label>
                      <input required onChange={this.handleChange} type='text' alt='post' name='title' value={this.state.post.title === 'Add a new trip' ? '' : this.state.post.title} />
                    </div>
                    <div className='w-100'>
                      <label htmlFor='description'>description<span>*</span></label>
                      <input onChange={this.handleChange} type='text' alt='post' name='description' value={this.state.post.description} />
                    </div>
                  </Tab>
                  <Tab eventKey="location" title="Location">
                    <div className='w-50 float-left'>
                      <label htmlFor='country'>country</label>
                      <input required readOnly={true} type='text' alt='location' name='country' value={this.state.location.country} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='city'>city</label>
                      <input required readOnly={true} type='text' alt='location' name='city' value={this.state.location.city} />
                    </div>
                    <div className='w-100'>
                      <label htmlFor='altitude'>altitude</label>
                      <input type='text' readOnly={true} name='altitude' value={this.state.location.altitude} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='latitude' className={this.state.post.fileName !== '' && this.state.location.latitude === null ? 'danger-text' : null}>latitude<span>*</span></label>
                      <input required className={this.state.post.fileName !== '' && this.state.location.latitude === null ? 'danger' : null} readOnly={true} type='text' name='latitude' value={this.state.location.latitude} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='longitude' className={this.state.post.fileName !== '' && this.state.location.longitude === null ? 'danger-text' : null}>longitude<span>*</span></label>
                      <input required className={this.state.post.fileName !== '' && this.state.location.longitude === null ? 'danger' : null} readOnly={true} type='text' name='longitude' value={this.state.location.longitude} />
                    </div>
                  </Tab>
                  <Tab eventKey="exif" title="Exif">
                    <div className='w-100'>
                      <label htmlFor='dateCreated'>date Created</label>
                      <input readOnly={true} type='text' name='dateCreated' value={this.state.exif.dateCreated} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='aperture'>aperture</label>
                      <input readOnly={true} type='text' name='aperture' value={this.state.exif.aperture} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='exposureTime'>exposure Time</label>
                      <input readOnly={true} type='text' name='exposureTime' value={this.state.exif.exposureTime} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='fNumber'>f Number</label>
                      <input readOnly={true} type='text' name='fNumber' value={this.state.exif.fNumber} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='focalLength'>focal Length</label>
                      <input readOnly={true} type='text' name='focalLength' value={this.state.exif.focalLength} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='iso'>iso</label>
                      <input readOnly={true} type='text' name='iso' value={this.state.exif.iso} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='shutterSpeed'>shutter Speed</label>
                      <input readOnly={true} type='text' name='shutterSpeed' value={this.state.exif.shutterSpeed} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='deviceBrand'>device Brand</label>
                      <input readOnly={true} type='text' name='deviceBrand' value={this.state.exif.deviceBrand} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='deviceModel'>device Model</label>
                      <input readOnly={true} type='text' name='deviceModel' value={this.state.exif.deviceModel} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='width'>width</label>
                      <input readOnly={true} type='text' name='width' value={this.state.exif.width} />
                    </div>
                    <div className='w-50 float-left'>
                      <label htmlFor='height'>height</label>
                      <input readOnly={true} type='text' name='height' value={this.state.exif.height} />
                    </div>
                  </Tab>
                  <Tab eventKey="panorama" title="Panorama">
                    {/* panorama settings */}
                    <div className='w-100 mt-3'>
                      <label className='text-center'>Settings</label>
                      <label className='w-25 float-left'>Pitch</label>
                      <input className='w-25 float-left' type='number' name='minPitch' min='-90' value={this.state.panorama.minPitch} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='pitch' min='-90' max='90' value={this.state.panorama.pitch} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='maxPitch' max='90' value={this.state.panorama.maxPitch} onChange={this.handlePanoramaSettings}></input>

                      <label className='w-25 float-left'>Yaw</label>
                      <input className='w-25 float-left' type='number' name='minYaw' min='-180' value={this.state.panorama.minYaw} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='yaw' min='-180' max='180' value={this.state.panorama.yaw} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='maxYaw' max='180' value={this.state.panorama.maxYaw} onChange={this.handlePanoramaSettings}></input>

                      <label className='w-25 float-left'>Hfov</label>
                      <input className='w-25 float-left' type='number' name='minHfov' min='50' value={this.state.panorama.minHfov} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='hfov' min='50' max='150' value={this.state.panorama.hfov} onChange={this.handlePanoramaSettings}></input>
                      <input className='w-25 float-left' type='number' name='maxHfov' max='150' value={this.state.panorama.maxHfov} onChange={this.handlePanoramaSettings}></input>
                    </div>

                    {/* fields for creating hotspots */}
                    <div className='w-100 mt-3'>
                      <label className='w-100 title text-center'>Add hotspots</label>
                      <label className='w-25 float-left' htmlFor='pitch'>Pitch<span>*</span></label>
                      <input className='w-75 float-left' type='number' name='hotSpotPitch' value={this.state.addHotSpot.hotSpotPitch} onChange={this.handleHotSpot}></input>
                      <label className='w-25 float-left' htmlFor='yaw'>yaw<span>*</span></label>
                      <input className='w-75 float-left' type='number' name='hotSpotYaw' value={this.state.addHotSpot.hotSpotYaw} onChange={this.handleHotSpot}></input>
                      <label className='w-25 float-left' htmlFor='name'>name<span>*</span></label>
                      <input className='w-75 float-left' type='text' name='hotSpotName' value={this.state.addHotSpot.hotSpotName} onChange={this.handleHotSpot}></input>
                      <div className='w-50'>
                        <button className='basic-button' disabled={this.state.panorama.hotSpots.length > 4 ? true : false} onClick={this.createHotSpot}>Add hotspot</button>
                      </div>
                    </div>

                    {this.state.panorama.hotSpots !== []
                      ? <div className='w-100 mt-3'>
                        <label className='w-100 title text-center'>Hotspots</label>
                        {this.state.panorama.hotSpots.map((hotSpot, index) =>
                          <div key={index} className='hotspot'>
                            <div className='w-100'>
                              <label className='w-25 float-left' htmlFor='pitch'>Pitch</label>
                              <input className='w-75 float-left' type='number' name={`pitch${index}`} value={hotSpot.pitch} readOnly={true}></input>
                              <label className='w-25 float-left' htmlFor='yaw'>yaw</label>
                              <input className='w-75 float-left text-center' type='number' name={`yaw${index}`} value={hotSpot.yaw} readOnly={true}></input>
                              <label className='w-25 float-left' htmlFor='name'>name</label>
                              <input className='w-75 float-left text-center' type='text' name={`name${index}`} value={hotSpot.name} readOnly={true}></input>
                            </div>
                            <div className='w-50 float-left d-flex align-items-center'>
                              <label htmlFor={`uploadHotSpotImage${index}`} className='basic-button'>{hotSpot.localUrl ? 'Change image' : 'Select image'}</label>
                              <input
                                className='uploadButton w100p hide'
                                type='file'
                                name={`uploadHotSpotImage${index}`}
                                id={`uploadHotSpotImage${index}`}
                                accept='.jpg, .png, .heif, .heic .tiff .HEIC'
                                onChange={(event) => this.selectHotSpotImage(event, index)}
                              />
                            </div>
                            <div className='w-50 float-left'>
                              {hotSpot.localUrl
                                ? <img src={hotSpot.localUrl} alt={hotSpot.name} />
                                : null
                              }
                            </div>
                          </div>
                        )}
                      </div>
                      : null}
                  </Tab>
                </Tabs>
                : null}
            </div>

            <div className='footer'>
              <div className='w-100 d-flex'>
                <div className='w-50 float-left flex-1'>
                  <label htmlFor="uploadPano" className='basic-button'>{this.state.post.url ? 'Change ' : 'Select '} panorama</label>
                  <input
                    className='uploadButton w-100 hide'
                    type='file'
                    name='uploadPano'
                    id='uploadPano'
                    accept='.jpg, .png, .heif, .heic .tiff .HEIC'
                    onChange={(event) => this.uploadPano(event)}
                  />
                </div>
                {this.state.post.url
                  ? <div className='w-50 float-left'>
                    <button className='basic-button submit'>Add trip</button>
                  </div>
                  : null}
              </div>
            </div>
          </form>
        </div >
      </div >
    );
  }
}

export default AddTrip;
