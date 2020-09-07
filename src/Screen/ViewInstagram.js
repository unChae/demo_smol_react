import React from 'react';
import * as config from '../config';
import styles from '../CSS/ViewInstagram.css';

class ViewInstagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    // 서버로부터 parameter값을 받음
    let code = this.props.location.search.split("=")[1];
    if(code) {
      this.getAccessToken(code);
    }
  }

  getAccessToken(code) {
    let url = "https://api.instagram.com/oauth/access_token";
    console.log(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI, code);
    // axios나 fetch를 사용하면 cors문제로 토큰값을 받아올 수 없어서 XMLHttpRequest를 사용했다
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    // 개발자 계정 client_id
    formData.append('client_id', config.CLIENT_ID);
    // 개발자 계정 client_secret
    formData.append('client_secret', config.CLIENT_SECRET);
    formData.append('grant_type', 'authorization_code');
    // 개발자 계정에 등록되어있는 redirect uri 값
    formData.append('redirect_uri', config.REDIRECT_URI);
    // 접근한 사용자의 code값
    formData.append('code', code);
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
          // string으로 값이 넘어와서 spring => json 형변환
          let token = JSON.parse(xhr.responseText).access_token;
          this.fetchData(token);
        } else {
          console.error(xhr.responseText);
        }
    }.bind(this);
    xhr.open('POST', url);
    // 폼 데이터 객체 전송
    xhr.send(formData); 
  }

  async fetchData(token) {
    console.log("fetch", token);

    // 인스타그램 요청 api 주소
    let url = "https://graph.instagram.com/me/media?";
    // 내가 받아오고 싶은 내용 fields 파라매터에 추가 & 토큰 값 함께 전송
    url += "fields=id,username,media_type,media_url,timestamp,caption&access_token=" + token;
    
    // 데이터를 담을 배열 변수 생성
    let res = [];

    // 데이터를 GET 방식으로 요청
    let itemData = await fetch(url, {
      method: "GET",
      headers: {
          'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    
    // 받아온 데이터 res 배열에 담기
    res.push(itemData)
    
    try{
      // 25개의 피드씩 받아와 지기 때문에 다음 페이지 url에 요청해서 받아와야한다.
      // 만약 itemData.paging.next 즉 다음 페이지가 존재하지 않는다면(사용자의 피드가 25개 이하) 에러가 발생해서 catch로 빠지게 된다.
      url = itemData.paging.next
      while(true) {
        let nextData = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type':'application/json'
            }
        })   
        .then(response => response.json()) 

        // 다음 페이지 데이터 res 배열에 담기
        res.push(nextData);

        // 현재 페이지가 마지막 페이지일 경우 break를 통해 while 구문을 나가게 된다.
        if(!nextData.paging.next) {
            break;
        }
        // 다음 페이지가 존재한다면 url 주소 변경
        url = nextData.paging.next;
      }
    }catch(err){
        console.log("no data")
    }
    
    // index.html에 있는 ul 객체 생성
    let itemlist = document.getElementById("itemlist");

    for(let i = 0; i < res.length; i++) {
      // 받아온 데이터를 반복문을 통하여 추출
      res[i].data.forEach((item, index) => {
          // createElement 함수를 이용하여 li 태그 객체 생성
          let elem = document.createElement("li");

          // 날짜 형식 바꿔주는 코드
          let date = new Date(item.timestamp);
          date = date.toString().split("GMT")[0];

          // li 태크로 생성된 elem에 HTML 소스코드 입력
          elem.innerHTML = `
          <li class="ig_li">
              <img class="ig_img" src="${item.media_url}">
              <card class="ig_card">
                  <div class="ig_content">
                      <span class="ig_title">${item.caption}</span>
                      <p class="ig_timestamp">${date}</p>
                  </div>
              </card>
          </li>
          `;

          // 추가한 소스코드 index.html에 있는 ul에 추가
          itemlist.append(elem);
      })
    }
  }

  render() {
    return (
      <div className={styles}>
        <ul id="itemlist"></ul>
      </div>
    );
  }
}

export default ViewInstagram;
