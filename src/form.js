import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
	Input,
	Button,
	Label,
	Spinner,
	Card,
} from 'reactstrap';

/*
  "Axios"-библиотека используется для создания HTTP-клиента в JavaScript для возможности
отправлять запросы на интересующий разработчика сторонний сайт и получать JSON-ответы для
их обработки и вывода.
  Ниже мы импортируем этот модуль:
*/
import axios from 'axios';

// Импорт redux-хранилища из файла "index.js", где оно создаётся
import {store, set_store, delete_store, set_total} from './index.js'

import App from './App.js'

var is_refreshing = false;

function Gui(props) {
	// Функция для отправки очередного запроса и его обработки:
	const send_request = (startIndex = 0, limit = 40, value, orderBy, category) => {
		// используем инструмент "axios" для возможности отправки на сторонний сервер запросов
		// и получения от него ответов:
		axios.get(`https://www.googleapis.com/books/v1/volumes?q=${value}&orderBy=${orderBy}&startIndex=${startIndex}&maxResults=${limit}`)
			.then(res => {
				const data = res.data;  // получаем json-ответ от сервера и сохраняем его
				if (startIndex == 0)
					store.dispatch(set_total(data.totalItems));
				
				// перебираем элементы в полученном json'е для сохранения
				// очередной книги в центральном redux-хранилище:
				for (let i = 0; i < data.items.length; ++i) {
					const item = data.items[i];
					
					if (category != 'all') {  // если пользователь указал конкретную категорию книг в соответствующем поле формы, то выбирать из ответа сервера книги только такой категории
						if ((item.volumeInfo.mainCategory != null)&&(item.volumeInfo.mainCategory.includes(category))) {  // обработка json-поля mainCategory... (если главная категория соответствует искомой, то сохранить обрабатываемое произведение...)
							store.dispatch(set_store({  // сохранить в redux-хранилище...
														title: item.volumeInfo.title,  // название книги
														authors: item.volumeInfo.authors,  // авторы этого произведения
														categories: item.volumeInfo.categories,  // категории
														description: item.volumeInfo.description,  // описание книги
														thumbnail: item.volumeInfo.imageLinks != null ? item.volumeInfo.imageLinks.thumbnail : '',  // ссылка на обложку книги
													}));
						} else {  // обработка json-массива "categories"...
							if (item.volumeInfo.categories != null) {  // если такое поле у книги есть, то...
								for (let j = 0; j < item.volumeInfo.categories.length; ++j) {  // пройтись по всем категориям этой книги и определить искомую...
									const category_j = item.volumeInfo.categories[j].toLowerCase();
									if (category_j.includes(category)) {  // если искомая категория найдена, то сохранить текущую обрабатываемую книгу для показа пользователю...
										store.dispatch(set_store({  // сохранить в redux-хранилище...
														title: item.volumeInfo.title,  // название книги
														authors: item.volumeInfo.authors,  // авторы этого произведения
														categories: item.volumeInfo.categories,  // категории
														description: item.volumeInfo.description,  // описание книги
														thumbnail: item.volumeInfo.imageLinks != null ? item.volumeInfo.imageLinks.thumbnail : '',  // ссылка на обложку книги
													}));
									}
								}
							}
						}
					} else {  // если же конкретную категорию пользователь не указал, то просто сохранить очередное произведение в redux...
						store.dispatch(set_store({  // сохранить в redux-хранилище...
														title: item.volumeInfo.title,  // название книги
														authors: item.volumeInfo.authors,  // авторы этого произведения
														categories: item.volumeInfo.categories,  // категории
														description: item.volumeInfo.description,  // описание книги
														thumbnail: item.volumeInfo.imageLinks != null ? item.volumeInfo.imageLinks.thumbnail : '',  // ссылка на обложку книги
													}));
					}
				}
			});
	}
	
	// Функция для реализации поиска интересных пользователю книг:
	const search = (isnot_load_more = false) => {
		const value = document.getElementById('input').value;  // берём поисковый запрос от пользователя
		let orderBy = document.getElementById('sorting').value.toLowerCase();  // получаем порядок сортировки
		const category = document.getElementById('category').value.toLowerCase();  // узнаём введённую пользователем категорию
		//const key = 'AIzaSyDpPFN32PnpIYqy98_ZNR7Y37pakjwQ1Xk';  // API key в этом проекте не используем в поисковых запросах
		
		if (orderBy == 'relevant')
			orderBy = 'relevance';
		
		if (!is_refreshing) {
			store.subscribe(props.refresh);
			is_refreshing = true;
		}
		
		if (isnot_load_more == true) {  // если нажали на кнопку "search", то...
			store.dispatch(delete_store());  // тут мы удаляем все ранее показанные пользователю книги
			const limit = 40;  // устанавливаем предел дозаполнения нашего массива книг "books", который предназначен для показа результатов
			const startIndex = 0;  // начальный поисковый индекс для указания его в запросе
			send_request(startIndex, limit, value, orderBy, category);  // послать запрос на Google-сервер и обработать ответ от него...
		} else {  // если же нажали на кнопку "load more", то...
			if (store.getState().books.length == 0)  // если пользователь ещё не нажимал на кнопку "Search", то ждём, пока он нажмёт именно на неё!
				return;
			
			const limit = 30;  // устанавливаем предел дозаполнения нашего массива книг "books", который предназначен для показа результатов
			const startIndex = store.getState().books.length;  // начальный поисковый индекс для указания его в запросе
			send_request(startIndex, limit, value, orderBy, category);  // послать запрос на Google-сервер и обработать от него ответ...
		}
	}
	
	// Функция для обработки нажатия на кнопку "Search":
	const searchEventListener = () => {
		const elem_spinner = document.getElementById('spinner');  // определяем и сохраняем элемент на странице со Спиннером
		elem_spinner.className = 'Spinner-shown';  // показываем этот Спиннер с загрузкой:
		props.refresh();  // перерисовываем приложение для появления спиннера
		
		search(true);  // вызываем функцию для поиска на google-сервере нужных пользователю книг
		
		// Скрываем ещё через секунду Спиннер с загрузкой:
		setTimeout(() => {elem_spinner.className = 'Spinner-hidden'; }, 1000);
		props.refresh();  // перерисовываем приложение для скрытия Спиннера
	}
	
	const spinner = (<div id='spinner' className='Spinner-hidden'><Spinner /></div>);  // спиннер, указывающий на процесс обработки запроса от пользователя
	
	// HTML-код формы для пользователя:
	return (
		<div className="form">
			<p>
				<Input id="input" name="input" placeholder="type to find"/>
				<Button onClick={searchEventListener} id="search">Search</Button>
			</p>
			<p>
				<Label for="category">
					Category:&nbsp;
				</Label>
				<Input id="category" name="category" type="select">
					<option selected>all</option>
					<option>art</option>
					<option>biography</option>
					<option>computers</option>
					<option>history</option>
					<option>medical</option>
					<option>poetry</option>
				</Input>
				<Label for="sorting">
					Sorting by:&nbsp;
				</Label>
				<Input id="sorting" name="sorting" type="select">
					<option selected>relevant</option>
					<option>newest</option>
				</Input>
			</p>
			
			{spinner}
			<Button style={{margin: '22vh 11.5vw', position: 'fixed', 'z-index': '3'}} onClick={search}>Show more</Button>
		</div>
	);
}

export default Gui;
