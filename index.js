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

let width = 10;
let bombCount = 10;
let squares = [];

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