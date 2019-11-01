// Версия 2.0. Потому что есть пару свободных часов, и потому что могу :)
// Переделал в функциональном стиле, изменил подход, более внятные имена переменных.
// Первую попытку не трогал, ибо я сказал что сделаю задание за 2 дня.
// Этот вариант сделан уже фактически за 3 дня, а я за честность.
// Чтобы проверить версию сделанную за 2 дня, в index.html замените
// script.js и styles.css на те, что в папке Version 1.0.

// Найти нужные элементы в DOM:
const body = document.querySelector('body');
const table = document.querySelector('.tableMain');
const addRowButton = document.querySelector('.add-row');
const addCellButton = document.querySelector('.add-column');
const removeRowButton = document.querySelector('.remove-row');
const removeCellButton = document.querySelector('.remove-column');

// Присвоить обработчики клика на кнопки:
addRowButton.addEventListener('click', () => createRow());
addCellButton.addEventListener('click', () => createCell());
removeRowButton.addEventListener('click', () => deleteRow());
removeCellButton.addEventListener('click', () => deleteCell());

// (Изменено в 2.0)
// Сдвигать кнопки относительно ячейки, на которую наведен курсор:
table.addEventListener('mouseover', event => movingButtons(event));
// По заданным условиям отображать / скрывать кнопки удаления:
body.addEventListener('mouseover', event => visibleButtons(event));

// (Изменено в 2.0)
// Функция, что отвечает за работу с видимостью кнопок.
// Сейчас она работает более правильно, ибо в версии 1.0, при
// наведении курсора на кнопку, она исчезала через пол секунды.
// Здесь я это поправил, теперь всё чётко как в ТЗ.
visibleButtons = ({ target }) => {
  const closestTable = target.closest('.tableMain');
  const closestButton = target.closest('.remove');

  if (closestTable || closestButton) {
    showButtons();
  };

  if (!closestTable && !closestButton) {
    hideButtons();
  };
};

// (Добавлено в 2.0)
// Функция, что отвечает за передвижение кнопок:
movingButtons = ({ target }) => {
  if (target.tagName === 'TD') {
    // Найти текущие "координаты" ячейки внутри таблицы...
    currentColumn = target.cellIndex;
    currentRow = target.parentNode.rowIndex;
    // ...и сдвинуть кнопки удаления относительно этих координат:
    removeCellButton.style.left = `${target.offsetLeft}px`;
    removeRowButton.style.top = `${target.offsetTop}px`;
  };
};

createCell = () => {
  for (let i = 0; i < table.rows.length; i++) {
    table.rows[i].insertCell();
  };
};

createRow = () => {
  table.insertRow();
  // Найти сколько ячеек находится в первой (нулевой) строке,
  // и вставить столько же ячеек в создаваемую строку
  for (let i = 0; i < table.rows[0].cells.length; i++) {
    table.rows[table.rows.length - 1].insertCell(i);
  };
};

deleteCell = () => {
  // В каждой строке таблицы...
  for (let i = 0; i < table.rows.length; i++) {
    // ...удалить выбранную ячейку:
    table.rows[i].deleteCell(currentColumn);
  };
  // При клике сразу скрыть кнопки удаления без задержки:
  displayNoneButtons();
};

deleteRow = () => {
  table.deleteRow(currentRow);
  // При клике сразу скрыть кнопки удаления без задержки:
  displayNoneButtons();
};

// (Добавлено в 2.0)
// Отдельный метод для быстрого скрытия кнопок после нажатия.
// Если использовать не display а visibility, то будет задержка.
displayNoneButtons = () => {
  removeRowButton.style.display = 'none';
  removeCellButton.style.display = 'none';
};

hideButtons = () => {
  removeRowButton.style.visibility = 'hidden';
  removeCellButton.style.visibility = 'hidden';
};

// (Изменено в 2.0)
// Если осталась последняя строка / колонка, кнопку скрывать:
showButtons = () => {
  if (table.rows.length > 1) {
    removeRowButton.style.visibility = 'visible';
    removeRowButton.style.display = 'block';
  };

  if (table.rows[0].cells.length > 1) {
    removeCellButton.style.visibility = 'visible';
    removeCellButton.style.display = 'block';
  };
};

// (Изменено в 2.0)
const Table = (column, rows) => {
  // Немного улучшил и расширил проверку вводимых данных,
  // чтобы на выходе всегда получать таблицу с ячейками.
  if (Number.isNaN(column) || column == undefined || column <= 0 || typeof column != 'number') {
    column = 4;
  };

  if (Number.isNaN(rows) || rows == undefined || rows <= 0 || typeof rows != 'number') {
    rows = 4;
  };

  // Наполнить таблицу заданным количеством таблиц и строк
  for (let row = 0; row < rows; row++) {
    const addRow = table.insertRow(row);

    for (let cells = 0; cells < column; cells++) {
      addRow.insertCell(cells);
    };
  };
};

Table(NaN, undefined, 'hello Bro');