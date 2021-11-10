import React from 'react';
import ReactDOM from 'react-dom';

/*
  Импорт библиотеки "Redux", предназначенной для хранения состояний компонентов приложения
в одном месте и возможности дать абсолютно КАЖДОЙ компоненте всей иерархии компонент доступ
к состояниям ВСЕХ других компонент и к изменению этих состояний по надобности.
	
  При изменении какого-нибудь состояния в "Redux" ВСЕГДА создаётся НОВОЕ состояние с
изменённым значением, и не подвергается прямому воздействию само изменяющееся состояние!
Это одно из отличий Редукса от "MobX" (вместе с единственным хранилищем состояний и отсутствием классов).
*/

import {useDispatch, useSelector} from 'react-redux';

/*
  "Axios"-библиотека используется для создания HTTP-клиента в JavaScript для возможности
отправлять запросы на интересующий разработчика сторонний сайт и получать JSON-ответы для
их обработки и вывода.
  Ниже мы импортируем этот модуль:
*/
import axios from 'axios';

// Импорт redux-хранилища из файла "index.js", где оно создаётся
import store from './index.js'

import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';

import ui_elements from './form.js'

// Файл со стилями:
import './index.css';

/* Функция для изменения хранилища - выводимой библиотеки книг в результате поиска */
function set_store(value) {
    return {
        type: 'SET_BOOKS',
        payload: value
    };
}

/*
	Компонент-функция, который предназначен для вывода библиотеки книг
(то есть вывода хранилища Redux).
Параметр "props" у нас в функции не используется!
*/
function Output(props) {
	const books = store.getState().books;  // получаем книги из центрального redux-хранилища 
	let output = [];  // готовим новый массив для вывода каждой книги
	
	// Ниже в цикле мы засовываем поочерёдно книги из хранилища "Redux":
	for (let i = 0; i < books.length; ++i)
		output.push(<li id='i'>{books[i]}</li>);
	
	return output;  // выводим на страницу созданный список книг
}

var flag = false;

/*
	Компонент, представляющий собой главное приложение с
нужной в задании функциональностью.
Параметр "props" в этой функции также не используется!
*/
function App(props) {
	const dispatch = useDispatch();  // этот объект предоставляет доступ к хранилищу "Redux"
	//const storage = useSelector(state => props.store.books);
	store.subscribe(Output);  // при изменении хранилища обновить данные страницы сайта
	
	// используем инструмент "axios" для возможности отправки на сторонний сервер запросов
	// и получения от него ответов:
	axios.get(`https://www.googleapis.com/books/v1/volumes?q=potter&maxResults=3`)
	.then(res => {
		const data = res.data;  // получаем json-ответ от сервера и сохраняем его
		
		// перебираем элементы в полученном json'е для сохранения
		// очередной книги в центральном redux-хранилище:
		for (let i = 0; i < data.items.length; ++i) {
			const item = data.items[i];
			store.dispatch(set_store(item.volumeInfo.title));
		}
	});
	
	const title = 'Search for books';  // заголовок страницы поиска книг
	
	return (
		<div className="App">
			<h1>{title}</h1>
				{ui_elements()}
			<ul><Output /></ul>
		</div>
	);
}

export default App;