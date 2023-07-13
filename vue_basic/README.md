# 뷰 기초 공부

## 보간법

Vue.js 의 HTML 요소 에서는 {{}} 와 같은 템플릿 표현식을 사용해 선언적으로 데이터를 렌더링 한다.
{{}} 의 모양이 콧수염을 닮아 콧수염 표현식이라고도 하며 문자열을 템플릿에 덧붙여 표현 한다고 해서 보간법 이라고도 부른다.

## 기본 디렉티브

### v-text, v-html 디렉티브

Vue 디렉티브는 템플릿 안에 사용하는 v- 로 시작하는 속성이며, 이것을 이용해 HTML 요소와 관련된 작업을 할 수 있다.

```
<div id="app">
    <h2>{{massage}}</h2>
</div>

와 같은 HTML 태그를 디렉티브로 변경 시키면 다음과 같다

<div id="app">
    <h2 v-text="message"></h2>
</div>
```

보간법이 편하다고 느낄수도 있지만 불편한 점도 있다.

- v-text, {{}}

  - innerText 속성에 연결됨 따라서 태그 문자열을 HTML 인코딩하여 나타내기 때문에 화면에 <li></li> 같은 태그 문자열이 그대로 나타남

- v-html
  - innerHTML 속성에 연결됨으로 태그 문자열을 파싱하여 화면에 나타낸다.

두개와 같은 차이점이 있으므로 상황에 따라 잘 사용하는게 중요할 것 같다.
하지만 대부분의 경우 {{}} 로 개발하는데 문제가 없다고 한다.

### v-bind 디렉티브

v-bind 디렉티브는 요소(Element)의 속성을 바인딩하기 위해 사용한다.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app">
        <input id="a" type="text" v-bind:value="message"/>
        <br />
        <img v-bind:src="imagePath"/>
    </div>
    <script type="text/javascript" src="https://unpkg.com/vue"></script>
    <script type="text/javascript">
        var vm = Vue.createApp({
            name: "App",
            data() {
                return {
                    message: 'v-bind 디렉티브',
                    imagePath: "https://contactsvc.bmaster.kro.kr/photos/18.jpg"
                }
            }
        }).mount('#app')
    </script>
</body>
</html>
```

v-bind디렉티브를 통해서 HTML 요소객체의 속성이 변경 됐음을 알 수 있다 이러한 기법을 데이터 바인딩이라 부른다.
v-bind 디렉티브를 매번 작성 하는게 귀찮으면 v-bind:src 에서 v-bind 를 생략하고 :src 만 작성 해도 된다.

```
v-bind:src = :src
```

v-bind 디렉티브는 단방향으로만 데이터 바인딩을 수행하며 Vue 인스턴스의 데이터나 속성이 바뀌면 UI 를 갱신한다.
데이터로 부터 화면 UI 로만 단반향 데이터 바인딩을 하므로
데이터 값을 변경 하더라도 개발자 도구로 확인시 변경이 안 된 것을 확인 할 수 있다.

### v-model 디렉티브

- {{}}, v-text, v-html, v-bind 디렉티브는 단방향 데이터 바인딩을 지원한다.
- 단방향 데이터 바인딩이 아니라 양방향 데이터 바인딩을 사용 하고 싶으면 v-model 디렉티브를 사용하면 된다.
- v-model 디렉티브는 v-bind 디렉티브와 달리 input 에 값이 입력 되면 elements 도 변경 되는 것을 볼 수 있다.
- v-model 디렉티브를 이용해 양방향 데이터 바인딩은 input 말고 다른 곳에도 사용이 가능하다. 사용 하는곳은 다음과 같다.
  - checkbox
  - select
  - radio button
- v-model은 다중 선택의 경우는 배열을 이용해야하고 단일 선택은 문자열로 값을 받아낸다.
- checkbox, radio와 같이 input 요소를 사용하는 경우는 각각의 input 요소마다 v-model 디렉티브를 적용 하지만 select 와 같이 값을 선택하는 요소를 감싸는 부모 요소가 있다면 부모 요소인 select 에 v-model 디렉티브를 한번만 적용 해야한다.

```
    <input
        type="checkbox"
        v-model="agree"
        true-value="yes"
        false-value="no"
    />
```

input에 다음과 같이 true-value, false-value 를 넣으면 선택 미선택으로 구분하여 값을 전달 할 수 있다.

### 수식어

v-model 디렉티브는 몇 가지 수식어를 지원한다.
수식어는 디렉티브에 특혈한 기능을 추가하는 vue 의 문법 요소이다.

- v-model 에서 사용할 수 있는 수식어는 다음과 같다.

```
• lazy: 입력폼에서 다른 요소로 포커스가 이동하는 이벤트가 발생할 때 입력한 값을 데이터와 동기화 한다.

ex) <input type="text" v-model.lazy="name" />

• number: 이 수식어를 지정하면 숫자가 입력될 경우 number 타입의 값으로 자동 형변환되어 데이터 옵션 값으로 반영된다.

ex) <input type="text" v-model.number="num" />

• trim: 이 수식어를 지정하면 문자열의 앞뒤 공백을 자동으로 제거한다.

ex) <input type="text" v-model.trim="message" />

v-model.trim.lazy 와 같이 한번에 여러개의 수식어를 부여 할 수도 있다.

```

- v-model.number
  - 숫자로 형변환이 가능한 값을 입력하면 정상적으로 형변환 되어 숫자로 값이 저장된다.
  - 123123ㅁㅁㅁㅁ 와 같이 앞부분이 숫자로 형변환이 가능한 문자열을 입력하면 앞에서 부터 형변환이 가능한 부분만 숫자로 변환하여 값을 할당한다.
  - 형변환이 불가능한 문자열은 문자열로 저장된다.

### v-model의 한글 처리

- v-model 에서 한글을 처리 할 때 는 한글 한글자가 입력이 완료 될 때 처리 되고 있기 때문에 "가나다"를 입력 했는데 "가나"만 입력된다.

이러한 문제는 이벤트 처리를 통해 간단히 해결 할 수 있다.

v-model_korean 을 보면 v-model 디렉티브 대신에 :value (v-bind) 디렉티브 를 이용해 단방향 데이터를 바인딩 하고 있다.
하지만 @input="changeName" 과 같이 이벤트 핸들러를 등록하여
프록시에 methods 부분에서 사용자가 입력한 값을 name 데이터로 부여하고 있다.
이로써 한글 입력 문제가 해결 된 것을 볼 수있다.

## 조건 렌더링 디렉티브

- 개발을 하다 보면 조건에 따라 화면에 렌더링 할지 말지를 결정해야 하는 경우가 있다.
- 이런경우에 v-show, v-if, v-if-else, v-else 등의 조건 렌더링과 관련된 디렉티브를 이용하여 렌더링 할지 말지 결정 할 수 있다.

### v-show

- v-show 는 화면에 보여줄지 말지를 결정하는 디렉티브이다.
- 렌더링은 수행하지만 화면에 보여주지는 않을 수 있다.

```
<img
    v-show="amount < 0"
    src="https://contactsvc.bmaster.kro.kr/img/error.png"
    title="마이너스는 허용하지 않습니다.""
    style="width: 15px; height: 15px; vertical-align: middle"
/>
```

v-show="amount < 0" 의 조건 과 같이 부여된 조건이 true 일 때만 화면에 보여준다.
false 일 때 개발자 도구에서 보면 display 속성이 none으로 돼 있는것을 알 수 있다.

### v-if

- v-if는 조건에 부합되지 않을 경우 렌더링을 수행하지 않도록 한다.
- v-show와의 차이점은 렌더링을 수행할지 아닐지 인 것 같다.

```
<img
    v-if="amount < 0"
    src="https://contactsvc.bmaster.kro.kr/img/error.png"
    title="마이너스는 허용하지 않습니다.""
    style="width: 15px; height: 15px; vertical-align: middle"
/>
```

정리하면 다음과 같다.
v-show는 보안 정보를 다루는 경우라면 사용하면 안 되고 v-if 를 사용해야한다.

### v-else, v-else-if

- v-if 와 함께 v-else, v-else-if 디렉티브를 사용하면 js 의 if ~ else if ~ else 문과 같은 조건 처리를 할 수 있다.

```
<span v-if="balance >= 1000000">Gold</span>
<span v-else-if="balance >= 500000">Silver</span>
<span v-else-if="balance >= 200000">Bronze</span>
<span v-else>Basic</span>
```

## 반복 렌더링 디렉티브

### v-for 디렉티브

- v-for 은 js의 for 문과 유사하게 반복적인 데이터를 렌더링하기 위해서 v-for 디렉티브를 사용한다.

```
  <body>
    <div id="app">
      <table id="list">
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>전화번호</th>
          </tr>
        </thead>
        <tbody id="contacts">
          <tr v-for="contact in contacts" v-bind:key="contact.no">
            <td>{{contact.no}}</td>
            <td>{{contact.name}}</td>
            <td>{{contact.tel}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <script type="text/javascript" src="https://unpkg.com/vue"></script>
    <script type="text/javascript">
      const vm = Vue.createApp({
        name: "App",
        data() {
          return {
            pageno: 1,
            pagesize: 4,
            totalcount: 100,
            contacts: [
              { no: 1011, name: "RM", tel: "010-3456-8299" },
              { no: 1012, name: "정국", tel: "010-3456-8298" },
              { no: 1013, name: "제이홉", tel: "010-3456-8297" },
              { no: 1014, name: "슈가", tel: "010-3456-8296" },
            ],
          };
        },
      }).mount("#app");
    </script>
  </body>
```

- v-for 은 원본 데이터가 객체인 경우에는 사용방법이 달라진다.

```
  <body>
    <div id="app">
      <select id="regions">
        <option disabled="disabled" selected>지역을 선택하세요.</option>
        <option v-for="(val, key) in regions" v-bind:value="key" :key="key">
          {{val}}
        </option>
      </select>
    </div>
    <script type="text/javascript" src="https://unpkg.com/vue"></script>
    <script type="text/javascript">
      const vm = Vue.createApp({
        name: "App",
        data() {
          return {
            regions: {
              A: "Asia",
              B: "America",
              C: "Europe",
              D: "Africa",
              E: "Oceania",
            },
          };
        },
      }).mount("#app");
    </script>
  </body>
```

- regions 는 배열이 아니라 객체이며 v-for 디렉티브를 보면 (val, key) 를 작성한 것을 볼 수 있다.
- val에 텍스트가 전달 되고 key 에 객체의 키갑이 전달된다.
- 인덱스 번호를 함께 표현해야 한다면 다음과 같다.

  ```
  배열 데이터인 경우
  <tr v-for="(contact, index) in contacts" ...>...</tr>

  객체 데이터인 경우
  <option v-for="(val, key, index) in regions" ...>...</option>
  ```

필드에 인덱스 번호를 이용하려면 다음과 같다.

```
<tbody id="contacts">
    <tr v-for="(contact, index) in contacts" :key="contact.no">
        <td>{{index+1}}</td>
        <td>{{contact.name}}</td>
        <td>{{contact.tel}}</td>
    </tr>
</tbody>
```

### 여러 요소를 묶어서 반복 렌더링

- 여러 요소를 묶어서 반복 렌더링을 하고 싶으면 <template> 요소와 v-for 디렉티브를 함께 사용하면 된다.
- v-for-multi-element.html 참고
  - v-for-multi-element 에서는 <tr> 요소를 한 번에 반복 렌더링하기 위해 <template> 태그로 묶었다.
  - <template> 태그는 렌더링 내용에는 포함하지는 않지만 요소드를을 그룹으로 묶어주기 위한 용도로 사용된다.

### v-for 디렉티브와 key 특성

key 특성은 v-for 디렉티브에서 :key='c.no' 와 같이 지정한 부부이다.
vue.js 는 가상돔을 지원하며 가상돔은 렌더링 속도를 빠르게 하기 위해 변경 된 부분만 업데이트 한다.
vuu.js 의 가상돔은 v-for로 렌더링한 배열 데이터의 순서가 변경되면 DOM 요소를 이동시키지 않고 기존 돔 요소의 데이터를 변경한다.

돔 요소를 추적하여 돔 요소의 위치를 직접 변경하려고 한다면 돔 요소에 key 특성을 부여할 수 있다.
v-bind 디렉티브를 이용해 key 특성에 고유한 값을 부여하면 된다.

key 특성을 부여하지 않아도 렌더링은 수행되지만 배열 내부의 데이터가 빈번하게 변경되는 경우는 모든 배열 요소를 렌더링 하기 때문에 성능에 좋지 않다.
key 특성을 부여하면 변경되지 않은 것은 가상돔에 대한 렌더링을 수행하지 않을 수 있기 때문에 더 좋은 성능을 낼 수 있다.

key 특성에는 인덱스 번호를 부여하면 안되고 반드시 고유한 변경되지 않는 값을 부여해야 한다.
인덱스를 키에 넣으면 데이터가 새로 추가되거나 삭제 됐을 때 key가 모두 변경되기 때문에 모두 렌더링을 다시 시도 하기 때문이다.

## 기타 디렉티브

### v-pre 디렉티브

v-pre 는 HTML 요소에 대한 컴파일을 수행하지 않는다.
v-pre.html 을 참고 하여 보면
v-pre를 사용한 부분에 보간법이 적용 이 안되고 {{message}} 를 그대로 출력하는 것을 볼 수 있다.
위와 같이 템플릿 문자열을 컴파일하지 않고 그대로 내보내기 위해 v-pre를 사용한다.

### v-once 디렉티브

v-once 디렉티브는 HTML 요소를 단 한번만 렌더링 하도록 한다.
v-pre.html 의 v-pre 부분을 v-once로 수정한 뒤 실행 시키면 정상적으로 데이터를 출력 하는 것을 볼 수 있다.
v-once는 초기 렌더링이 완료 된 후 데이터가 변경 되더라도 다시 렌더링이 되지 않는다.

### v-cloak 디렉티브

v-cloak 디렉티브는 v-for 디렉티브를 이용해 많은 데이터를 출력할 때 보간법 표현식이 화면에 일시적으로 보이는 현상이 있다.
이것의 이유는 vue의 인스턴스가 템플릿을 컴파일 할 때 발생하는 시간 때문에 일어나는 현상이다.
이와 같은 경우에 사용할 수 있는 디렉티브가 v-cloak 이다.
v-cloak 은 화면에 초기에 컴파일되지 않은 템플릿은 나타나지 않도록 할 수 있다.

## 동적 아규먼트(Dynamic Argument)

- 동적 아규먼트는 디렉티브를 이용해 연결하고자 하는 특성의 이름을 데이터나 속성으로 연결할 수 있도록 하는 문법이다.
- v-bind 디렉티브나 이벤트 처리를 위한 v-on 디렉티브에서 사용한다.

- v-bind

```
<element v-bind:[attribute] = "[attribute]"></element>
<element :[attribute] = "[attribute]"></element>
```

- v-on

```
<element v-on:[eventName] = "[function code]"></element>
<element @[eventName] = "[function code]"></element>
```

### 동적 아규먼트 제약 사항

- v-bind:[attribute] 와 같은 부분에서 사용하는 키 이름은 대문자를 사용해도 소문자인 데이터를 엑세스 하려 한다.
- 따라서 혼란을 피하려면 키 이름은 소문자로 하는 것이 좋다.
- v-bind:[attribute + num] 과 같이 [] 내부 표현식으로 연산식을 사용할 수 없다.
  - 복잡한 키 이름을 동적으로 생성 하여 사용해야 한다면 계산된 속성(computed property) 를 이용해야 한다.
- Infinity, NaN, Math, Number 와 같은 문자열은 키 이름으로 사용하지 못한다.
  - 전역 화이트리스트로 등록되어 있어 엑세스 할 수 없다.
  - 전역 화이트 리스트 목록은 다음과 같다.
    - https://github.com/vuejs/vue-next/blob/master/packages/shared/src/globalsWhitelist.ts

### 여러개의 속성 bind

- v-bind-multi-attribute 를 참고 해서 보면 image1 객체는 attrName : attrValue 로 구성 돼 있다. 이러한 데이터를 바인딩 하면 다음과 같은 기능을 가진다.

```
<img
  src: "http://contactsvc.bmaster.kro.kr/photos/18.jpg",
  title: "Lily's photo",
/>
```

여러개의 특성, 속성을 한번에 바인딩 할 때 좋다.
