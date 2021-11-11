import React from 'react';
import ReactDOM from 'react-dom';
import {
	Input,
	Button,
	Label,
	Spinner
} from 'reactstrap';

/*
  "Axios"-библиотека используется для создания HTTP-клиента в JavaScript для возможности
отправлять запросы на интересующий разработчика сторонний сайт и получать JSON-ответы для
их обработки и вывода.
  Ниже мы импортируем этот модуль:
*/
import axios from 'axios';

// Импорт redux-хранилища из файла "index.js", где оно создаётся
import {store, set_store, delete_store} from './index.js'

function Gui(props) {
	const search = () => {
		const value = document.getElementById('input').value;
		
		// используем инструмент "axios" для возможности отправки на сторонний сервер запросов
		// и получения от него ответов:
		axios.get(`https://www.googleapis.com/books/v1/volumes?q=${value}&maxResults=30`)
			.then(res => {
				store.dispatch(delete_store());
				const data = res.data;  // получаем json-ответ от сервера и сохраняем его
				
				// перебираем элементы в полученном json'е для сохранения
				// очередной книги в центральном redux-хранилище:
				for (let i = 0; i < data.items.length; ++i) {
					const item = data.items[i];
					store.dispatch(set_store(item.volumeInfo.title));
				}
			});
	}
	
	
	return (
		<div className="form">
			<p>
				<Input id="input" name="input" placeholder="type to find"/>
				<Button onClick={search}>Search</Button>
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
		</div>
	);
}

export default Gui;
