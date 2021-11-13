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
import {store, set_store, delete_store, set_total} from './index.js'

import {
	Input,
	Button,
	Label,
	Spinner,
	Card, CardBody, CardTitle, CardSubtitle, CardText,
} from 'reactstrap';

import Gui from './form.js';

// Файл со стилями:
import './index.css';

/*
	Компонент, представляющий собой главное приложение с
нужной в задании функциональностью:
*/
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {  // состояние для возможности перерисовать страницу
			books: []
		}
	}
	
	/* Функция-обработчик нажатия по блоку с детальной информацией (нужно скрыть его): */
	hide_card = () => {
		const card_info = document.getElementById("Card_info");
		const results = document.getElementById("Results");
		
		results.className = "Results";
		card_info.className = "Card-invisible";
	}
	
	/* Функция, открывающая карточку с выбранной пользователем книгой: */
	openCard = (event) => {
		const card = event.currentTarget;  // получить объект нажатой карточки
		const card_info = document.getElementById("Card_info");  // получить пока что невидимый блок с информацией о выбранной карточке
		const results = document.getElementById("Results");  // также определить и сохранить блок с результатами поиска
		
		/*
			Ниже в цикле найти информацию о нажатой карточке в нашем массиве с результатами "books"
		и показать эту более подробную информацию пользователю:
		*/
		for (let i = 0; i < this.state.books.length; ++i) {
			if (this.state.books[i].thumbnail == card.id) {  // id наших карточек - это ссылки на обложки соответствующих книг (они же уникальны))
				card_info.className = "Card-visible";  // показать блок с подробной информацией о книге
				results.className = "Card-invisible";  // скрыть блок с результатами поиска
				card_info.onclick = this.hide_card;  // привязать обработчик нажатия по показанному только что блоку (это нужно, чтобы выйти из этого блока с детальной информацией)
				// а ниже заполнить блок с детальной информацией данными:
				card_info.innerHTML = "<p>Title: " + (this.state.books[i].title != null ? this.state.books[i].title : 'NONE') + "</p>" + "<p>Authors: " + (this.state.books[i].authors != null ? this.state.books[i].authors : 'NONE') + "</p>" + "<p>Categories: " + (this.state.books[i].categories != null ? this.state.books[i].categories.map((elem) => (elem + " ")) : 'NONE') + "</p>" + "<img src=" + this.state.books[i].thumbnail + "/>" + "<p id='desc'>" + (this.state.books[i].description != null ? this.state.books[i].description : 'NONE') + "</p>";
				break;  // выйти из цикла
			}
		}
	}
	
	// обновить состояние приложения для ре-рендеринга нашей страницы сайта:
	refresh = () => {
		this.setState({books: store.getState().books});
	}
	
	render() {
		const title = 'Search for books';  // заголовок страницы поиска книг
		const books = store.getState().books;  // получаем книги из центрального redux-хранилища
		
		let output = [];  // готовим новый массив для вывода каждой книги
		
		// Ниже в цикле мы засовываем поочерёдно книги из хранилища "Redux" в массив "output":
		for (let i = 0; i < books.length; ++i) {
			output.push(<Card id={books[i].thumbnail} className="Card" onClick={this.openCard}>
									<CardBody className="CardBody">
										<img src={books[i].thumbnail} />
										<CardTitle className="CardTitle">
											{books[i].title}
										</CardTitle>
										<CardSubtitle className="CardSubtitle">
											{books[i].authors != null ? books[i].authors.map((author, index) => {
												if (index != books[i].authors.length - 1)
													return `${author}` + ', ';
												else
													return `${author}`;
											}) : ''}
										</CardSubtitle>
										<CardText>
											{books[i].categories != null ? books[i].categories[0] : ''}
										</CardText>
									</CardBody>
								</Card>);
		}
		
		// Выводим:
		return (
			<div>
				<div className="App">
					<h1>{title}</h1>
						<Gui refresh={this.refresh}/>
				</div>
				<div id="Card_info" className="Card-invisible"></div>
				<div id="Results" className="Results">
					<span className="Total">Total (all categories): {store.getState().total}</span>
					{output}
				</div>
			</div>
		);
	}
}

export default App;