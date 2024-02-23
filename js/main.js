import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/ea7f748bc3e364acfd4e7f0331ccd057/raw/2d91cc64277d42d7ffdd9995d6af9cfcff950b3a/four-card-data.txt';

const sectionWrapperEl = document.querySelector('.section-wrapper');
const sectionTemplate = document.getElementById('section-template');
const sectionHeadTemplate = document.getElementById('section-head-template');
const cardTemplate = document.getElementById('card-template');
const sectionBodyTemplate = document.getElementById('section-body-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	sectionWrapperEl.appendChild(errorEl);
};

const renderCardsContent = (data) => {
	const resData = data.split('\n');

	const cardsSummaryData = resData.slice(0, resData.indexOf(''));
	let cardsListData = resData.slice(resData.indexOf('') + 1);
	const filteredCardsListData = cardsListData.filter((item) => Boolean(item));

	const [cardsSummaryTitle, cardsSummarySubtitle, cardsSummaryDescription] =
		cardsSummaryData;

	const spaceSize = cardsListData.indexOf('');
	const tempData = [];
	for (let i = 0; i < filteredCardsListData.length; i += spaceSize) {
		tempData.push(filteredCardsListData.slice(i, i + spaceSize));
	}
	cardsListData = tempData;

	const sectionTemplateNode = document.importNode(
		sectionTemplate.content,
		true
	);
	const sectionEl = sectionTemplateNode.querySelector('.section');

	/* [section head] */
	const sectionHeadTemplateNode = document.importNode(
		sectionHeadTemplate.content,
		true
	);
	const sectionHeadEl =
		sectionHeadTemplateNode.querySelector('.section__head');

	const cardsSummaryTitleEl = sectionHeadEl.querySelector(
		'.cards-summary__title'
	);
	cardsSummaryTitleEl.textContent = cardsSummaryTitle;

	const cardsSummarySubtitleEl = sectionHeadEl.querySelector(
		'.cards-summary__subtitle strong'
	);
	cardsSummarySubtitleEl.textContent = cardsSummarySubtitle;

	const cardsSummaryDescriptionEl = sectionHeadEl.querySelector(
		'.cards-summary__desc'
	);
	cardsSummaryDescriptionEl.textContent = cardsSummaryDescription;

	/* [section body] */
	const sectionBodyTemplateNode = document.importNode(
		sectionBodyTemplate.content,
		true
	);
	const sectionBodyEl =
		sectionBodyTemplateNode.querySelector('.section__body');

	const cardBlockEls = sectionBodyEl.querySelectorAll('.cards__block');

	for (let i = 0; i < cardsListData.length; i++) {
		const [title, description, image] = cardsListData[i];

		const cardTemplateNode = document.importNode(
			cardTemplate.content,
			true
		);
		const cardEl = cardTemplateNode.querySelector('.card');
		cardEl.classList.add('card--' + title.toLowerCase().replace(' ', '-'));

		const cardTitleEl = cardEl.querySelector('.card__title');
		cardTitleEl.textContent = title;

		const cardDescriptionEl = cardEl.querySelector('.card__desc');
		cardDescriptionEl.textContent = description;

		const cardImage = cardEl.querySelector('.card__image img');
		cardImage.src = './images/icons/' + image;
		cardImage.alt = '';

		if (i === 0) {
			cardBlockEls[0].appendChild(cardTemplateNode);
		} else if (i === 1 || i === 2) {
			cardBlockEls[1].appendChild(cardTemplateNode);
		} else {
			cardBlockEls[2].appendChild(cardTemplateNode);
		}
	}

	/* [init] */
	removeLoading();
	sectionEl.appendChild(sectionHeadTemplateNode);
	sectionEl.appendChild(sectionBodyTemplateNode);
	sectionWrapperEl.appendChild(sectionTemplateNode);
};

sendHttpRequest('GET', URL, renderCardsContent, handleError);
