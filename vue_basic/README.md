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
