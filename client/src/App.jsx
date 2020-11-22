import React from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { listLogEntries } from './API';
import Interface from './Interface';
import Trip from './Trip';

interface iTrip {
  location: {
    country: string,
    region: string,
    city: string,
    postcode: string,
    address: string,
    altitude: number,
    latitude: number,
    longitude: number
  },
  photo: {
    aperture: string,
    dateCreated: string,
    exposureTime: string,
    fNumber: string,
    focalLength: string,
    iso: string,
    shutterSpeed: string,
    width: string,
    height: number,
    deviceBrand: string,
    deviceModel: string
  },
  post: {
    description: string,
    fileName: string,
    imagePath: string,
    parentFolder: string,
    title: string,
  },
  _id: string,
  createdAt: string,
  updatedAt: string,
};

interface MyProps { };

interface MyState {
  logEntries: [],
  showMarkers: boolean,
  showPopup: any,
  viewPort: {
    width: string,
    height: string,
    latitude: number,
    longitude: number,
    zoom: number,
    minZoom: number,
  },
}

var vMin = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;

class App extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props);

    this.state = {
      logEntries: [],
      showMarkers: true,
      showPopup: [],
      viewPort: {
        width: '100vw',
        height: '100vh',
        latitude: 46.024,
        longitude: 6.097,
        zoom: 4.44,
        minZoom: 1.4,
      },
    }

    this.closeTrip = this.closeTrip.bind(this);
  }
  closeTrip() {
    this.setState({ ...this.state, showMarkers: true, showPopup: [], });
  }

  componentDidMount() {
    (
      async () => {
        const logEntries = await listLogEntries();
        this.setState({ ...this.state, logEntries: logEntries });
      })()
  }

  render() {
    var wh = 0.015 * vMin * this.state.viewPort.zoom;

    return (
      <>
        <ReactMapGL
          {...this.state.viewPort}
          mapStyle="mapbox://styles/gbcatrinoiu/ckdcw1p9y0hul1iqnjkpd8ism"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={(viewPort) => this.setState({ ...this.state, viewPort })}
          attributionControl={false}>
          {this.state.logEntries !== null ?
            this.state.logEntries.map((trip: iTrip, index) => (
              <div key={index}>
                <Marker
                  key={index}
                  className={this.state.showMarkers ? 'marker' : 'marker zIndex-1'}
                  latitude={trip.location.latitude}
                  longitude={trip.location.longitude}
                  offsetTop={-wh}
                  offsetLeft={-wh / 2}>
                  <div
                    className='marker-container'
                    style={{
                      width: wh + 'px',
                      height: wh + 'px',
                      maxWidth: wh + 'px',
                      maxHeight: wh + 'px',
                    }}
                    onClick={() => this.setState({
                      ...this.state,
                      showMarkers: !this.state.showMarkers,
                      showPopup: {
                        [trip._id]: true,
                      },
                    })}>
                    <img src={`./uploads/${trip.post.parentFolder}/${trip.post.fileName}`} alt={trip.post.title} />
                  </div>
                </Marker>
                {this.state.showPopup[trip._id] ? (
                  <Trip trip={trip} onCloseTrip={this.closeTrip} />
                ) : null}
              </div>
            )) : null}
        </ReactMapGL>
        <Interface closeTrip={this.closeTrip} />
      </>
    );
  }
}

export default App;
