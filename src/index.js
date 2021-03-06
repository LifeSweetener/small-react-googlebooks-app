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

// Элементы хранилища:
const defaultState = {
	books: [],
	total: 0
};

const reducer = (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_BOOKS':  // сохранить найденную книгу из поисковика Google в наше центральное хранилище "Redux"...
			// Если наш массив с книгами для вывода пользователю не содержит найденную книгу,
			// или он вообще пустой, то указать в нём новую книгу из результата поиска:
			if (state.books != null)
				for (let i = 0; i < state.books.length; ++i)
					if (JSON.stringify(state.books[i]) == JSON.stringify(action.payload))
						return state;
			
			let new_books = state.books != null ? state.books.slice() : [];  // если наш массив с книгами для показа его пользователю не пуст, то копировать его и сохранить в переменную "new_books", иначе - создать новый пустой массив
			new_books.push(action.payload);  // засунуть в массив очередную книгу из результатов поиска пользователя
			return {books:  new_books, total: state.total};  // обновить хранилище дозаполненным массивом с книгами
		case 'DELETE_BOOKS':  // очистить абсолютно всю нашу библиотеку с книгами для показа пользователю на странице сайта...
			return {books:  [], total: 0};
		case 'SET_TOTAL':
			const new_total = action.payload;
			return {books: state.books, total: new_total};
		default:  // действие по умолчанию (ничего не делать)
			return state;
	}
}

/* Функция для изменения хранилища - выводимой библиотеки книг в результате поиска */
const set_store = (value) => {
	return {
		type: 'SET_BOOKS',
		payload: value
	};
}

/* Функция для очистки содержимого нашего Redux-хранилища: */
const delete_store = (value=[]) => {
	return {
		type: 'DELETE_BOOKS',
		payload: value
	};
}

/* Установить общее число найденных произведений: */
const set_total = (value) => {
	return {
		type: 'SET_TOTAL',
		payload: value
	};
}

const store = createStore(reducer);  // наше центральное хранилище всего React-приложения

export {store, set_store, delete_store, set_total};  // экспортировать все важные функции и само хранилище для других модулей нашего приложения

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	
	document.getElementById('root')
);