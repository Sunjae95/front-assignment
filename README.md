### 실행방법

```
yarn install
yarn dev
```

### Button, Checkbox, PageLayout 컴포넌트

Button 컴포넌트는 두가지 테마와 3개의 사이즈로 구성했습니다. 테마를 구분하는 기준은 background-color와 border의 유무로 구현했습니다.
두 컴포넌트의 컴포넌트 내부 계산을 줄이기 위해 네이티브로 구현했습니다. 버튼 기능뿐만 아니라 disabled 같은 속성을 사용할 수 있어 loading같은 UI를 업데이트해주는데 유리하게 구현했습니다.

### Alert 컴포넌트

createPortal 메서드를 사용하여 어디서든 선언해도 document.body에 종속되도록 하여 전역변수의 사용을 줄였습니다. 버튼을 자유롭게 받아 확인, 취소 기능 뿐만 아니라 단순히 알려줄 수 있도록 확장성 있게 구현했습니다.

### Modal 컴포넌트

Modal컴포넌트부터는 도메인에 종속되는 컴포넌트입니다. 초기 기획은 도메인에 종속한 컴포넌트는 components폴더가 아닌 지역 폴더를 만들어 선언하려 했으나 해당 과제의 사이즈를 고려하여 components 폴더에 위치했습니다. 종속되는 컴포넌트이므로 form을 사용하여 해당 도메인에 맞는 server action 요청을 하도록 구현했습니다.

### TodoList 컴포넌트

create, update, delete를 하기위해 todolist 컴포넌트에는 상태가 많이 존재합니다.
각 action에 구분이 필요하여 백엔드 데이터인 todo id값을 적극활용하여 구분했습니다.
api 요청은 server side fetching과 try catch문으로 loading, error case를 함께 구현했습니다.

### DetailForm 컴포넌트

상세페이지에서 사용하는 CSR입니다. 기능, 가독성, 돔 최소화를 위해 readOnly와 css를 활용하여 구현했습니다. 구현하면서 `type="submit"` 버튼에 useRouter의 push, replace와 같은 메서드를 등록하여 테스트하다가 해당 페이지의 히스토리가 새롭게 갱신되는것을 확인했습니다. 제가 원하는 기능은 shallow routing이라는 키워드를 알게 됐고 그 과정에서 button에 submit 타입이 작성된 것을 수정하여 페이지 라우팅 문제를 해결할 수 있었습니다.

editor모드를 searchParams로 두어 새로고침해도 그 수정 페이지에 그대로 남을 수 있도록 구현했습니다.

### not-found

todo와 같은 상세 id를 조회할 수 없는 경우가 존재하기에 action 함수에서 요청에 성공하지 못하면 not found 함수를 활용하여 사용자에게 잘못된 페이지 접근을 노출했습니다.
