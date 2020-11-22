import React from 'react';
import { Pannellum } from 'pannellum-react';

const Hotspot = ({ pitch, yaw, name, index, localUrl }) => {

  function add(index, image) {
    const getHotSpot = document.getElementsByClassName(`hotSpot-${index}`);
    const div = document.createElement('div');
    const img = document.createElement('img');

    div.className = 'hotSpot-container';
    img.src = image.props.src;

    div.appendChild(img);
    getHotSpot[0].appendChild(div);

    console.log('as');
  }

  return (
    <Pannellum.Hotspot
      type="custom"
      pitch={pitch}
      yaw={yaw}
      name={name}
      cssClass={`hotSpot-${index}`}
      tooltip={(evt, args) => add(index, args)}
      tooltipArg={<img src={localUrl} />}
    />
  );
}

export default Hotspot;
