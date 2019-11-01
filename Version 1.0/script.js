// (Версия 1.0) Сделано за 2 дня.
// Я решил использовать именно class, так как (теоретически) в будущем такой
// компонент можно многократно использовать в различных местах приложения,
// при этом не изменяя исходный компонент, и даже не зная, как он устроен,
// ибо достаточно просто указать желаемое количество столбцов и строк.

class Table {

  constructor(column = 4, rows = 4) {
    // Наивное решение валидации принимаемых данных,
    // чтобы не получить пустую страницу вместо таблицы:
    if (column <= 0 || typeof column != "number") {
      column = 4;
    };

    if (rows <= 0 || typeof rows != "number") {
      rows = 4;
    };

    // Найти нужные элементы в DOM:
    this.table = document.querySelector('.tableMain');
    this.addRowButton = document.querySelector('.add-row');
    this.addCellButton = document.querySelector('.add-column');
    this.removeRowButton = document.querySelector('.remove-row');
    this.removeCellButton = document.querySelector('.remove-column');

    // Присвоить обработчики клика на кнопки:
    this.addRowButton.addEventListener('click', () => this.createRow());
    this.addCellButton.addEventListener('click', () => this.createCell());
    this.removeRowButton.addEventListener('click', () => this.deleteRow());
    this.removeCellButton.addEventListener('click', () => this.deleteCell());

    // Отслеживать находится ли курсор внутри таблицы:
    this.table.addEventListener('mouseover', event => this.visibleButtons(event));
    this.table.addEventListener('mouseleave', () => setTimeout(() => this.hiddenButtons(), 400));

    // Наполнить таблицу заданным количеством столбцов и строк:
    for (let row = 0; row < rows; row++) {
      const addRow = this.table.insertRow(row);

      for (let cells = 0; cells < column; cells++) {
        addRow.insertCell(cells);
      };
    };

  };

  createCell() {
    for (let i = 0; i < this.table.rows.length; i++) {
      this.table.rows[i].insertCell();
    };
  };

  createRow() {
    this.table.insertRow();
    // Найти сколько ячеек находится в первой (нулевой) строке,
    // и вставить столько же ячеек в создаваемую строку
    for (let i = 0; i < this.table.rows[0].cells.length; i++) {
      this.table.rows[this.table.rows.length - 1].insertCell(i);
    };
  };

  deleteCell() {
    // В каждой строке таблицы...
    for (let i = 0; i < this.table.rows.length; i++) {
      // ...удалить выбранную ячейку:
      this.table.rows[i].deleteCell(this.currentColumn);
    };
    // При клике сразу скрыть кнопки удаления без задержки:
    this.hiddenButtons();
  };

  deleteRow() {
    this.table.deleteRow(this.currentRow);
    // При клике сразу скрыть кнопки удаления без задержки:
    this.hiddenButtons();
  };

  hiddenButtons() {
    this.removeRowButton.style.display = 'none';
    this.removeCellButton.style.display = 'none';
  };

  visibleButtons({ target }) {
    // Найти элемент с тегом <td>, иначе кнопки будут "убегать" от мышки:
    if (target.tagName === 'TD') {
      // Найти текущие "координаты" ячейки внутри таблицы...
      this.currentColumn = target.cellIndex;
      this.currentRow = target.parentNode.rowIndex;
      // ...и сдвинуть кнопки удаления относительно этих координат:
      this.removeCellButton.style.left = `${target.offsetLeft}px`;
      this.removeRowButton.style.top = `${target.offsetTop}px`;
    };
    // Если в таблице осталась одна строка / колонка,
    // соответствующую кнопку удаления не отображать:
    if (this.table.rows.length > 1) {
      this.removeRowButton.style.display = 'block';
    };

    if (this.table.rows[0].cells.length > 1) {
      this.removeCellButton.style.display = 'block';
    };
  };

};

const TestTable = new Table(0, 0);