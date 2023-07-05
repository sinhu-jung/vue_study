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
 
+ v-text, {{}}
    - innerText 속성에 연결됨 따라서 태그 문자열을 HTML 인코딩하여 나타내기 때문에 화면에 <li></li> 같은 태그 문자열이 그대로 나타남

+ v-html
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

를 실행하게 되면 