import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import App from './App.js';

/*
  Импорт библиотеки "Redux", предназначенной для хранения состояний компонентов приложения
в одном месте и возможности дать абсолютно КАЖДОЙ компоненте всей иерархии компонент доступ
к состояниям ВСЕХ других компонент и к изменению этих состояний по надобности.
	
  При изменении какого-нибудь состояния в "Redux" ВСЕГДА создаётся НОВОЕ состояние с
изменённым значением, и не подвергается прямому воздействию само изменяющееся состояние!
Это одно из отличий Редукса от "MobX" (вместе с единственным хранилищем состояний и отсутствием классов).
*/
import {createStore} from 'redux';

// Файл со стилями:
import './index.css';

const defaultState = {
	books: []
};

const reducer = (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_BOOKS':
			if (state.books.indexOf(action.payload) == -1) {
				let new_books = state.books.slice();
				new_books.push(action.payload);
				return {books:  new_books};
			}
			return state;
		default:
			return state;
	}
};

const store = createStore(reducer);

export default store;

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	
	document.getElementById('root')
);