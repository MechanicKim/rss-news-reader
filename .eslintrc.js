module.exports = {
  env: {
    browser: true, // 브라우저 전역 변수 지원 설정
    es2021: true, // ECMAScript 2021 전역 변수 지원 설정
  },
  extends: [ // 다른 설정을 가져와 확장
	  'airbnb-base',
	  'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest', // ECMAScript 버전 설정
    sourceType: 'module', // parser의 export 형태를 지정
  },
};
