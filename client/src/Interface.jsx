import React, { useState } from 'react';
import login from './assets/log-in.svg'
import add from './assets/plus-square.svg'
import profile from './assets/profile.jpg';
import AddTrip from './AddTrip';

const Interface = ({ closeTrip }) => {
  const [settings, setSettings] = useState({
    showControlPanel: false,
    showLogin: false,
    showAddNew: false,
  });

  function onClickAddNew(closeTrip) {
    closeTrip();
    setSettings({ ...settings, showAddNew: !settings.showAddNew });
  }

  return (
    <>
      <div className='interface'>
        {/* <div className='searchBar'>
          <div>
            <input type='text' name='searchBar'></input>
          </div>
        </div> */}

        <div className={settings.showControlPanel === true ? 'controlPanel opened' : 'controlPanel'}>
          <div className='profile' onClick={() => setSettings({ ...settings, showControlPanel: !settings.showControlPanel })}>
            <img src={profile} alt='profilePciture Bogdan C.' />
          </div>
          <div className='buttons'>
            <ul>
              <li key={'1'}><img src={login} alt='login' /></li>
              <li key={'2'}><img src={add} alt='add' onClick={() => onClickAddNew(closeTrip)} /></li>
            </ul>
          </div>
        </div>

        {settings.showAddNew ? <AddTrip onClose={() => setSettings({ ...settings, showAddNew: false })} /> : null}
      </div>
    </>
  );
}

export default Interface;
