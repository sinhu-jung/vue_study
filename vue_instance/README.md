# Vue 인스턴스

```js
var vm = Vue.createApp({
  name: "App",
  data() {
    return { name: "" };
  },
}).mount("#app");
```

위와 같이 Vue.createApp 메서드를 호출하여 만들어진 객체를 애플리케이션 인스턴스라고 부른다.
전체 컴포넌트 트리는 애필리케이션 인스턴스를 마운트 할 때 렌더링 한다.

name,data 같이 vue 인스턴스를 생성할 때 전달하는 속성들을 담은 객체를 옵션(Option) 객체라고 부른다.

루트 인스턴스는 DOM 트리에 마운트 돼야 화면으로 렌더링한다.
마운트를위해 mount() 라는 애플리케이션 인스턴스의 메서드를 호출했고 그 결과 vm이라는 루트 컴포넌트 인스턴스가 리턴된다.

## data 옵션

data 옵션은 컴포넌트가 관리하고 추적해야 할 데이터를 등록할 때 사용한다.
data 옵션은 반드시 객체를 리턴하는 함수로 부여돼야 한다.
Vue 2.x 에서는 직접 객체를 지정하기도 했으나 3.x 버전부터는 함수가 부어 돼야 한다.

컴포넌트 인스턴스에서는 data에 대한 Proxy 접근을 할 수 있다.

```js
vm.name = "Hello"
 => "Hello"
vm.$data.name
=> "Hello"
```

$ 시작하는 이름은 인스턴스 내부에서 특수한용도로 사용되며 객체의 속성명으로 $, \_ 로 시작하는 이름을 사용하면 안된다.
v-instance-name 을 실행 시켜보면

[Vue warn]: Property "$name" must be accessed via $data because it starts with a reserved character ("$" or "\_") and is not proxied on the render context.

와 같은 경고를 발생 시키는 것을 볼 수 있다.

## 계산된 속성 (Computed Property)

계산된 속성은 data나 다른 속성이 변경될 때 함수가 실행되어 캐싱된 값이다.
함수의 실행은 의존하고 있는 속성 또는 data가 변경될 때 한 번 호출된다.
계산된 속성을 작성할 때는 computed 옵션에 함수를 등록하면 된다.

- v-computed-option 파일
  computed 옵션은 함수인데도 불구하고 보간법을 이용하여 데이터 인 것 처럼 사용한다.
  this.num이 바뀌면 computed에 등록된 sum() 함수가 호출되고 리턴된 값을 sum에 캐싱하게 되며 여러번 동일한 값을 렌더링 하더라도 sum() 함수는 단 한번만 호출한다.

계산된 속성은 set 메서드를 지정하면 쓰기 작업도 가능하다.
자바의 getter/setter 메서드라 생각하면 편할 것 같다.

- v-computed-option-set 파일
  get은 정규표현식 을 이용해 데이터 속성인 amt 값에 숫자 3자리마다 쉼표를 넣어서 리턴하도록 하며
  set은 문자열을 입력 받으면 쉽표를 제거한 뒤 숫자 값으로 변환하여 amt에 할당한다.

계산된 속성은 set 사용이 가능하지만 보통 get 기능만 제공할 목적으로 사용하는 경우가 많다.
그래서 기존 데이터를 이용해 읽기 전용의 값을 만들어내기 위해 자주 사용한다고 보면 될 것 같다.

## 메서드