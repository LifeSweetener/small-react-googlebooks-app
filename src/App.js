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
import {store, set_store, delete_store} from './index.js'

import {
	Input,
	Button,
	Label,
	Spinner
} from 'reactstrap';

import Gui from './form.js'

// Файл со стилями:
import './index.css';

/*
	Компонент, представляющий собой главное приложение с
нужной в задании функциональностью.
Параметр "props" в этой функции также не используется!
*/
class App extends React.Component {
	
	//const storage = useSelector(state => props.store.books);
	
	//const dispatch = useDispatch();  // этот объект предоставляет доступ к хранилищу "Redux"
	
	render() {
		const title = 'Search for books';  // заголовок страницы поиска книг
		//store.subscribe(render);  // при изменении хранилища обновить данные страницы сайта
		const books = store.getState().books;  // получаем книги из центрального redux-хранилища
		
		if (books == null)
			return null;
		
		let output = [];  // готовим новый массив для вывода каждой книги
		
		// Ниже в цикле мы засовываем поочерёдно книги из хранилища "Redux":
		for (let i = 0; i < books.length; ++i)
			output.push(<li id='i'>{books[i]}</li>);
		
		// Выводим:
		return (
			<div>
				<div className="App">
					<h1>{title}</h1>
						<Gui />
				</div>
				<div className="Results">
					<ul>{output}</ul>
				</div>
			</div>
		);
	}
}

export default App;