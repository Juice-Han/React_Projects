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
  let num : number[] = Array.from({length:12}, (_,i)=> i + 1)
  const images = num.map((n,i) => {
    return(
      <div className='story-box' style={{backgroundImage : `url('img/story-image/story${n}.jpg')`}} key={i}/>
    )
  })
  return(
    <div className='main-page'>
      <div className='story-container'>
        {images}
      </div>
    </div>
  )
}

const MenuBar : React.FC = ()=> {
  return(
    <div className='menu-bar'>
        <img className='insta-logo' src='img/menu-icon/insta-icon.png' alt=''/>
        <div className='menu-icon-container'>
          <img src='img/menu-icon/home-icon.png' alt=''/>
          <img src='img/menu-icon/search-icon.png' alt=''/>
          <img src='img/menu-icon/compass-icon.png' alt=''/>
          <img src='img/menu-icon/video-icon.png' alt=''/>
          <img src='img/menu-icon/message-icon.png' alt=''/>
          <img src='img/menu-icon/heart-icon.png' alt=''/>
          <img src='img/menu-icon/plus-icon.png' alt=''/>
          <img src='img/menu-icon/강아지.png' alt='' className='dog-icon'/>
        </div>
        <div className='bottom-menu-icon-container'>
          <img src='img/menu-icon/threads-icon.png' alt=''/>
          <img src='img/menu-icon/threeline-icon.png' alt=''/>
        </div>
      </div>
  )
}


export default App;