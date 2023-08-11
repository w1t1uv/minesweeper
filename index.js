const title = document.createElement('p');
title.classList.add('title');
title.innerHTML = 'Minesweeper';
document.body.append(title);

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.append(wrapper);

const grid = document.createElement('div');
grid.classList.add('grid');
wrapper.append(grid);

const newGameButton = document.createElement('div');
newGameButton.classList.add('new-game-button');
document.body.append(newGameButton);

const newGameTitle = document.createElement('p');
newGameTitle.classList.add('new-game-title');
newGameTitle.innerHTML = 'New game';
newGameButton.appendChild(newGameTitle);

const body = document.querySelector('body');

let width = 10;
let bombCount = 10;
let flags = 0;
let count = 0;
let sec = 0;
let squares = [];
let timerID;
let finalTime;
let isGameOver = false;
let totalMoves;

const trackingWrapper = document.createElement('div');
trackingWrapper.classList.add('tracking-wrapper');
document.body.append(trackingWrapper);

const timerWrapper = document.createElement('div');
timerWrapper.classList.add('timer-wrapper');
trackingWrapper.append(timerWrapper);

const timer = document.createElement('p');
timer.classList.add('timer');
timer.innerHTML = '0';
timerWrapper.append(timer);

const moveCountWrapper = document.createElement('div');
moveCountWrapper.classList.add('move-count-wrapper');
trackingWrapper.append(moveCountWrapper);

const moveCount = document.createElement('p');
moveCount.classList.add('move-count');
moveCount.innerHTML = '0';
moveCountWrapper.append(moveCount);

grid.addEventListener('click', startTimer, {once: true});
grid.addEventListener('click', finishTimer);

function startTimer() {
	if (!isGameOver) {
		timerID = setInterval(function () {
			sec++;
			timer.innerHTML = sec;
		}, 1000)
	}
}

function finishTimer(event) {
	let target = event.target;

	if (target.classList.contains('bomb')) {
		clearInterval(timerID);
		finalTime = timer.textContent;
	}
}

grid.addEventListener('click', moveCounter, true);

function moveCounter(event) {
	let target = event.target;

	if (target.classList.contains('valid') && !target.classList.contains('checked')) {
		count++;
		moveCount.innerHTML = `${count}`;
	}
	if (isGameOver) {
		grid.removeEventListener('click', moveCounter);
		totalMoves = count;
	}
}

function createBoard() {
	const bombArray = Array(bombCount).fill('bomb');
	const validArray = Array(width * width - bombCount).fill('valid');
	const gameArray = validArray.concat(bombArray);
	const shuffleArray = gameArray.sort(() => Math.random() - 0.5);

	for (let i = 0; i < width * width; i++) {
		const square = document.createElement('div');
		square.setAttribute('id', i);
		square.classList.add(shuffleArray[i]);
		grid.appendChild(square);
		squares.push(square);

		square.addEventListener('click', function (e) {
			click(square);
		}, true);

		square.addEventListener('contextmenu', function (e) {
			e.preventDefault();
			addFlag(square);
		}, true);
	}

	for (let i = 0; i < squares.length; i++) {
		let total = 0;
		const isLeft = i % width === 0;
		const isRight = i % width === width - 1;

		if (squares[i].classList.contains('valid')) {
			if (i > 0 && !isLeft && squares[i - 1].classList.contains('bomb')) {
				total++;
			}
			if (i > 9 && !isRight && squares[i + 1 - width].classList.contains('bomb')) {
				total++;
			}
			if (i > 10 && squares[i - width].classList.contains('bomb')) {
				total++;
			}
			if (i > 11 && !isLeft && squares[i - 1 - width].classList.contains('bomb')) {
				total++;
			}
			if (i < 98 && !isRight && squares[i + 1].classList.contains('bomb')) {
				total++;
			}
			if (i < 90 && !isLeft && squares[i - 1 + width].classList.contains('bomb')) {
				total++;
			}
			if (i < 88 && !isRight && squares[i + 1 + width].classList.contains('bomb')) {
				total++;
			}
			if (i < 89 && squares[i + width].classList.contains('bomb')) {
				total++;
			}
			squares[i].setAttribute('data', total);
		}
	}
}

createBoard();

function addFlag(square) {
	if (isGameOver) {
		return;
	}
	if (!square.classList.contains('checked') && (flags < bombCount)) {
		if (!square.classList.contains('flag')) {
			square.classList.add('flag');
			square.innerHTML = ' 🚩';
			flags++;
			winCheck();
		} else {
			square.classList.remove('flag');
			square.innerHTML = '';
			flags--;
		}
	}
}

function click(square) {
	let currentId = square.id;

	if (isGameOver) {
		return;
	}
	if (square.classList.contains('checked') || square.classList.contains('flag')) {
		return;
	}
	if (square.classList.contains('bomb')) {
		gameOver(square);
	} else {
		let total = square.getAttribute('data');
		if (total != 0) {
			square.classList.add('checked');
			if (total == 1) {
				square.classList.add('one');
			}
			if (total == 2) {
				square.classList.add('two');
			}
			if (total == 3) {
				square.classList.add('three');
			}
			if (total == 4) {
				square.classList.add('four');
			}
			square.innerHTML = total;
			return;
		}
		checkSquare(square, currentId);
	}
	square.classList.add('checked');
}

function checkSquare(square, currentId) {
	const isLeft = currentId % width === 0;
	const isRight = currentId % width === width - 1;

	setTimeout(() => {
		if (currentId > 0 && !isLeft) {
			const newId = squares[parseInt(currentId) - 1].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 9 && !isRight) {
			const newId = squares[parseInt(currentId) + 1 - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 10) {
			const newId = squares[parseInt(currentId - width)].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 11 && !isLeft) {
			const newId = squares[parseInt(currentId) - 1 - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 98 && !isRight) {
			const newId = squares[parseInt(currentId) + 1].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 90 && !isLeft) {
			const newId = squares[parseInt(currentId) - 1 + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 88 && !isRight) {
			const newId = squares[parseInt(currentId) + 1 + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 89) {
			const newId = squares[parseInt(currentId) + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
	}, 10)
}

const gameEnd = document.createElement('p');
gameEnd.classList.add('game-end');
gameEnd.innerHTML = 'Game over. Try again.';
document.body.append(gameEnd);

function gameOver(square) {
	gameEnd.style.opacity = '1';

	isGameOver = true;

	squares.forEach(square => {
		if (square.classList.contains('bomb')) {
			square.innerHTML = '💣';
		}
	})
}

let isWin = false;

function winCheck() {
	let matches = 0;

	for (let i = 0; i < squares.length; i++) {
		if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
			matches++;
		}
	}

	if (matches === bombCount) {
		isGameOver = true;
		isWin = true;
	}
}