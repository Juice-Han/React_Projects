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
  let name : string[] = ['이초롱','임바람','황가람','윤햇살','배새롬','심기쁨','류마음','전하나','강샛별','정온','성나무','정바다']
  const images = num.map((n,i) => {
    return(
      <div className='story-box'>
        <div className='story-img' style={{backgroundImage : `url('img/story-image/story${n}.jpg')`}} key={i}/>
        <div>{name[i]}</div>
      </div>
      
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