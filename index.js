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