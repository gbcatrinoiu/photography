import React from 'react';
import { Pannellum } from 'pannellum-react';

const Trip = ({ trip, onCloseTrip }) => {
  return (
    <div className='trip'>
      <Pannellum
        width="100vw"
        height="100vh"
        image={`./uploads/${trip.post.parentFolder}/${trip.post.fileName}`}
        pitch={1}
        yaw={400}
        hfov={100}
        autoLoad
        hotspotDebug={false}
        showControls={false}
      >
        {trip.panorama.hotSpots.map((item, index) => (
          <Pannellum.Hotspot
            type="custom"
            pitch={item.pith}
            yaw={item.yaw}
            text={item.name}
            key={index}
          />
        ))
        }
      </Pannellum>
      <div className='trip-popup'>
        <div>
          <div className='header'>
            <h2>{trip.post.title}</h2>
            <hr />
            <h3><strong>{trip.location.country}</strong>, {trip.location.city}</h3>
            <p>{trip.post.description}</p>
          </div>
          <div className='body'>
            {trip.location.country ? <p>Country: {trip.location.country}</p> : null}
            {trip.location.region ? <p>Region: {trip.location.region}</p> : null}
            {trip.location.city ? <p>City: {trip.location.city}</p> : null}
            {trip.location.address ? <p>Address: {trip.location.address}</p> : null}

            {trip.exif.aperture ? <p>Aperture: {trip.exif.aperture}</p> : null}
            {trip.exif.exposureTime ? <p>Exposure time: {trip.exif.exposureTime}</p> : null}
            {trip.exif.fNumber ? <p>F number: {trip.exif.fNumber}</p> : null}
            {trip.exif.focalLength ? <p>Focal lenght:{trip.exif.focalLength}</p> : null}
            {trip.location.altitude ? <p>Altitude: {trip.location.altitude}</p> : null}
            {trip.location.latitude ? <p>Latitude: {trip.location.latitude}</p> : null}
            {trip.location.longitude ? <p>Longitude: {trip.location.longitude}</p> : null}
            {trip.exif.iso ? <p>ISO: {trip.exif.iso}</p> : null}
            {trip.exif.deviceBrand ? <p>Device brand: {trip.exif.deviceBrand}</p> : null}
            {trip.exif.deviceModel ? <p>Device Model: {trip.exif.deviceModel}</p> : null}
            {trip.exif.width ? <p>Width: {trip.exif.width}</p> : null}
            {trip.exif.height ? <p>Height: {trip.exif.height}</p> : null}
            {trip.exif.shutterSpeed ? <p>Shutter speed: {trip.exif.shutterSpeed}</p> : null}
          </div>
          <div className='footer' onClick={onCloseTrip}>
            <p>Go back to map</p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Trip;