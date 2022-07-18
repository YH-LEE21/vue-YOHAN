const toReadableDate = (timeStamp) => {
  let dateObj = new Date(timeStamp);
  const toTwoDigits = (str) => {
    if (str.valueOf() < 10) {
      return '0' + str;
    }
    return str;
  }
  return `${toTwoDigits(dateObj.getMonth() + 1)}-${toTwoDigits(dateObj.getDate())}, ${toTwoDigits(dateObj.getHours())}:${toTwoDigits(dateObj.getMinutes())}`;
};

class Memo {
  constructor(obj) {
    // 1직장 2일상 3공부
    this.categoryId = obj.categoryId;
    // 20문자열
    this.title = obj.title;
    // 0문자 1그림
    this.type = obj.type;
    //카테고리가 텍스트인 경우 문자열; 그림인 경우，imageData
    this.content = obj.content;
    // 만든 시간（#json에 저장，문자열）
    this.timeStamp = toReadableDate(Date.parse(new Date()));
    // 기본값 false
    this.isCompleted = false;
    // 수정완료 여부
    this.modificationDone = true;
  }
  // 그림 크기 260*260 imageData
  getImageData (imageUrl) {
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', 260);
    canvas.setAttribute('height', 260);
    let image = new Image();
    image.src = imageUrl;
    // 이미지 로드 : 비동기작업  로딩후 고침
    this.modificationDone = false;
    image.onload = () => {
      canvas.getContext('2d').drawImage(image, 0, 0);
      this.content = canvas.toDataURL();
      this.modificationDone = true;
    };
  }
}

class VueMemoStore {
  constructor () {
    this.memos = [];
  }
  loadFromLocalStorage () {
    this.memos = JSON.parse(localStorage.getItem('store')).memos;
  }
  saveToLocalStorage () {
    // imgData 로딩 완료 후 저장
    let allModificationDoneFlag = setInterval(() => {
      if (!this.memos.some((item) => {
        return item.modificationDone === false;
      })) {
        clearInterval(allModificationDoneFlag);
        localStorage.setItem('store', JSON.stringify(this));
      }
    }, 10);
  }
  add (memo) {
    this.memos.push(memo);
  }
  remove (memo) {
    this.memos.splice(this.memos.indexOf(memo), 1);
  }
  update (memo, newMemo) {
    this.memos.splice(this.memos.indexOf(memo), 1, newMemo);
  }
  init () {

    let m1 = new Memo({
      categoryId: 3,
      title: '1. 스타일',
      type: 0,
      content: `이 앱은 [Bootstrap](https://www.getbootstrap.com)의 내비게이션 바 스타일과 그리드 시스템을 사용하였으며, 본체 부분의 배경은 [V2EX](https://www.v2ex.com)에서 왔다`
    });
    m1.timeStamp = toReadableDate(new Date(Date.parse('Oct 8, 2016')));
    this.add(m1);

    let m2 = new Memo({
      categoryId: 3,
      title: '2. 스타일',
      type: 0,
      content: `2.vue 2.0은 아래로 호환되지 않는다",type:0,content:"처음부터 1.0 한글 문서를 쓰다 보니 여러 가지 해결할 수 없는 문제들이 발견되었고, 나중에 보니 2는 호환되지 않는 것이었다.：\n\n a. 주기 후크 이름 바꾸기\n\n b. 사용 v-html 3대 괄호 대신 특성html텍스트 값을\n\n c. 사용하지 않는다 filterBy 、orderBy 등 필터 사용 권장 computed 대상\n\n d. $dispatch、$broadcast 、events 다 폐기....과감하게1.0으로 결정`
    });
    m1.timeStamp = toReadableDate(new Date(Date.parse('Oct 8, 2022')));
    this.add(m2);

    let m3 = new Memo({
      categoryId: 3,
      title: '3. vue의 로고는 잘만든것 같아요',
      type: 1,
    });
    m3.timeStamp = toReadableDate(new Date(Date.parse('Oct 6, 2022')));
    m3.getImageData('./src/images/vue-logo.png');
    this.add(m3);

    let m4 = new Memo({
      categoryId: 2,
      title: '4. 쇼핑',
      type: 0,
      content: `* 1.스파오 옷사기\n\n * 저녁\n\n * \n\n Type-C 충전기`,
    });
    m4.timeStamp = toReadableDate(new Date(Date.parse('Oct 7, 2022')));
    this.add(m4);

    let m5 = new Memo({
      categoryId: 1,
      title: '5. Westworld - Quote',
      type: 0,
      content: `> By most mechanical and dirty hand,\n\n> I shall have such revenges on you both.\n\n> The things I will do,\n\n> what they are yet I know not,\n\n> but they will be the terrors of the earth.`,
    });
    m5.timeStamp = toReadableDate(new Date(Date.parse('Oct 4, 2021')));
    this.add(m5);

    let m6 = new Memo({
      categoryId: 2,
      title: '6. 기묘한 이야기',
      type: 1,
    });
    m6.timeStamp = toReadableDate(new Date(Date.parse('Oct 5, 2020')));
    m6.getImageData('./src/images/strangerthings.jpg');
    this.add(m6);

    let m7 = new Memo({
      categoryId: 1,
      title: '7. 어린왕자',
      type: 0,
      content: `> **「비행기를 타고 아프리카 사막을 여행하고 있던 조종사가 비행기 고장으로 사막에 불시착을 하게 된다. 아무도 없을 것 같던 사막에서 생사를 고민하던 중 우연히 한 소년을 만나게 된다. 조종사는 이 소년과 대화하던 중 그가 다른 별에서 왔다는 것을 알게 되었다. 어린왕자는 B612라는 작은 혹성에서 살았는데 우연히 만난 장미에게 사랑을 느끼지만 장미는 어린왕자에게 상처만 줄 뿐이었다. 그때 어린왕자를 찾아온 사업가를 통해 다른 별의 이야기를 전해 듣고 더 큰 세상을 알면 장미의 행동을 이해할 수 있으리란 생각을 하며 여행을 결심한다.**`,
    });
    m7.timeStamp = toReadableDate(new Date(Date.parse('May 3, 2011')));
    this.add(m7);

    let m8 = new Memo({
      categoryId: 2,
      title: '8. 30 Seconds To Mars',
      type: 1,
    });
    m8.timeStamp = toReadableDate(new Date(Date.parse('Oct 2, 2016')));
    m8.getImageData('./src/images/30stm.png');
    this.add(m8);


    this.saveToLocalStorage();
  }
}

let store = new VueMemoStore();

if (localStorage.getItem('store') != null) {
  store.loadFromLocalStorage();
} else {
  store.init();
}

let storeUtil = {
  store,
  Memo,
}

export default storeUtil;
