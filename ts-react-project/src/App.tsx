import React, {useState} from 'react';
import './App.css';

const App : React.FC = ()=> {
  return (
    <div className="App">
      <MenuBar/>
      <MainPage/>
    </div>
  );
}

const MainPage : React.FC = ()=> {
  return(
    <div className='main-page'>
      <div className='story-container'>
      
      </div>
    </div>
  )
}

const MenuBar : React.FC = ()=> {
  return(
    <div className='menu-bar'>
        <img className='insta-logo' src='img/menu-icon/insta-icon.png' alt=''/>
        <div className='menu-icon-wrapper'>
          <img src='img/menu-icon/home-icon.png' alt=''/>
          <img src='img/menu-icon/search-icon.png' alt=''/>
          <img src='img/menu-icon/compass-icon.png' alt=''/>
          <img src='img/menu-icon/video-icon.png' alt=''/>
          <img src='img/menu-icon/message-icon.png' alt=''/>
          <img src='img/menu-icon/heart-icon.png' alt=''/>
          <img src='img/menu-icon/plus-icon.png' alt=''/>
          <img src='img/menu-icon/강아지.png' alt='' className='dog-icon'/>
        </div>
        <div className='bottom-menu-icon-wrapper'>
          <img src='img/menu-icon/threads-icon.png' alt=''/>
          <img src='img/menu-icon/threeline-icon.png'/>
        </div>
      </div>
  )
}


export default App;