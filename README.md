## Google API + KAKAO MAP API

```
npm i
node index.js
```

환경파일 <br>
google-api : credentials.json <br>
kakaomap : .env -> KAKAO_REST_API_KEY  


- 구글 스프레드 시트 API로 시트에서 주소를 읽어옴
- 읽어온 주소를 기반으로 X,Y,지번 주소를 가져옴


> 카카오 API는 어플리케이션 생성 후 앱키에서 REST API 키입력. & 카카오맵 활성화 설정 필요




---

[구글스프레드시트 API DOCS](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append?hl=ko) <br>
[구글스프레드시트 API키 생성](https://wise-office-worker.tistory.com/67) <br>
[카카오 API DOCS](https://developers.kakao.com/docs/latest/ko/local/dev-guide)
