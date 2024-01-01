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
      <div className='story-box' key={i}>
        <div className='story-img' style={{backgroundImage : `url('img/story-image/story${n}.jpg')`}}/>
        <div>{name[i]}</div>
      </div>
    )
  })
  return(
    <div className='main-page'>
      <div className='story-container'>
        {images}
      </div>
      <div className='contents-container'>
        <div className='profile-box'>
          <div className='profile-image' style={{backgroundImage: "url('img/story-image/story1.jpg')"}}></div>
          <h4>이초롱</h4>
          <p>﹒ 11시간</p>
          <div className='menu-box'>
            <img src='img/menu-icon/threeline-icon.png' alt=''></img>
          </div>
        </div>
        <div className='image-box'>
          <img src='img/contents-image/content1.jpg' alt=''></img>
        </div>
        <div className='icon-box'>
          <div className='icon-box_left'>
            <img src='img/menu-icon/heart-icon.png' alt=''></img>
            <img src='img/menu-icon/comment-icon.png' alt=''></img>
            <img src='img/menu-icon/message-icon.png' alt=''></img>
          </div>
          <div className='icon-box_middle'></div>
          <div className='icon-box_right'>
            <img src='img/menu-icon/bookmark-icon.png' alt=''></img>
          </div>
        </div>
        <div className='info-box'>
          <div className='info-box_likes'>좋아요 1320개</div>
          <div className='info-box_writing'>
            <span className='info-box_name'>이초롱</span>
            글 내용 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores itaque ut minus distinctio repellat repellendus exercitationem nam consequuntur neque soluta. Mollitia fuga placeat labore commodi cum modi fugit beatae doloremque.
          </div>
          <div className='info-box_see'>댓글 21개 모두 보기</div>
          <div className='info-box_comment-container'>
            <div className='info-box_comment-box'>
              <span className='info-box_name'>닉네임1</span>
              댓글1
            </div>
            <div  className='info-box_comment-box'> 
              <span className='info-box_name'>닉네임2</span>
              댓글2
            </div>
          </div>
          <div className='info-box_write-comment'>댓글 달기...</div>
        </div>
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