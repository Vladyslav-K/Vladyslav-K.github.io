// Version 2.1
// Главные изменения:
// class для приватности методов;
// Независимость компонентов друг от друга;
// Отображение ошибки введённых данных при создании таблицы;
// Создание таблиц полностью с помощью JS (не считая общих CSS стилей);
// Кнопка удаления не исчезает при клике, и всегда находится в пределах таблицы.
// Мелкие изменения:
// Исправлены размеры элементов (из rem в px);
// Плавные анимации передвижения / исчезновения / появления кнопок удаления.

// Version 2.2
// Исправлен баг с неверным определением ближайшего к кнопке удаления столбца / строки.

class Table {
  constructor(column, rows, containerClassName) {
    // Создать элемент, что будет выводиться
    // при некорректных введенных данных:
    let _error = document.createElement("div");
    _error.className = "error";
    _error.innerHTML = `
    <h1>Ошибка</h1>
    <h2>Пожалуйста, введите корректные начальные данные таблицы!</h2>
    <h3>
    Значения строк и колонок должны быть числами больше нуля,
    <br/>
    а передаваемое имя контейнера - строкой! 
    </h3>`;

    // Проверить на корректность введенные данные.
    // Если данные некорректные, вместо отрисовки таблиц
    // вывести пользователю сообщение об ошибке,
    // а для разработчика дать более конкретную информацию в консоль:
    if (column <= 0 || typeof column != "number") {
      document.body.append(_error);
      throw new Error(
        "Некорректное количество колонок (принимаются только числа больше нуля)"
      );
    }

    if (rows <= 0 || typeof rows != "number") {
      document.body.append(_error);
      throw new Error(
        "Некорректное количество строк (принимаются только числа больше нуля)"
      );
    }

    if (typeof containerClassName != "string") {
      document.body.append(_error);
      throw new Error("Некорректное имя контейнера (должно быть строкой)");
    }

    // Сохранить передаваемое имя контейнера
    // (нужно в будущем для отображения кнопок)
    this.containerName = containerClassName;

    // Создать все необходимые элементы:
    this.container = document.createElement("div");
    this.container.className = `${containerClassName} container`;
    document.querySelector(".global-container").append(this.container);

    this.table = document.createElement("table");
    this.table.className = `${containerClassName}-table tableMain`;
    this.container.append(this.table);

    this.addRowButton = document.createElement("div");
    this.addRowButton.className = `button add-row add`;
    this.addRowButton.innerHTML = "+";
    this.container.append(this.addRowButton);

    this.addColumnButton = document.createElement("div");
    this.addColumnButton.className = "button add-column add";
    this.addColumnButton.innerHTML = "+";
    this.container.append(this.addColumnButton);

    this.removeRowButton = document.createElement("div");
    this.removeRowButton.className = `button remove-row remove ${containerClassName}-remove-buttons`;
    this.removeRowButton.innerHTML = "-";
    this.container.append(this.removeRowButton);

    this.removeColumnButton = document.createElement("div");
    this.removeColumnButton.className = `button remove-column remove ${containerClassName}-remove-buttons`;
    this.removeColumnButton.innerHTML = "-";
    this.container.append(this.removeColumnButton);

    // Присвоить обработчики клика на кнопки:
    this.addRowButton.addEventListener("click", () => this.createRow());
    this.addColumnButton.addEventListener("click", () => this.createCell());
    this.removeRowButton.addEventListener("click", e => this.deleteRow(e));
    this.removeColumnButton.addEventListener("click", e => this.deleteCell(e));

    // Сдвигать кнопки относительно ячейки, на которую наведен курсор:
    this.container.addEventListener("mouseover", e => this.movingButtons(e));
    // По заданным условиям отображать / скрывать кнопки удаления:
    document.body.addEventListener("mouseover", e => this.visibleButtons(e));

    // Наполнить таблицу заданным количеством столбцов и строк:
    for (let row = 0; row < rows; row++) {
      const addRow = this.table.insertRow(row);

      for (let cells = 0; cells < column; cells++) {
        addRow.insertCell(cells);
      }
    }
  }
  // (ВАЖНОЕ ПОСЛЕДНЕЕ ИСПРАВЛЕНИЕ)
  findCurrentCell() {
    // Найти нулевую строку (потому что она 100% есть)
    const thisRow = this.table.rows[0];
    // Перебрать ячейки в нулевой строке, и если положение кнопки
    // совпадает с положением ячейки, отслеживать эту ячейку.
    // Положение сравнить по параметру left у кнопки, и отступу слева у ячейки.
    for (let i = 0, cell; (cell = thisRow.cells[i]); i++) {
      if (`${cell.offsetLeft}px` == this.removeColumnButton.style.left) {
        this.setCurrentColumn(cell.cellIndex);
      }
    }
  }
  // (ВАЖНОЕ ПОСЛЕДНЕЕ ИСПРАВЛЕНИЕ)
  findCurrentRow() {
    const thisTable = this.table;
    // Перебрать все строки в таблице, и если отступ сверху строки
    // совпадает с параметром top у кнопки, отслеживать строку.
    for (let i = 0, row; (row = thisTable.rows[i]); i++) {
      if (`${row.offsetTop}px` == this.removeRowButton.style.top) {
        this.setCurrentRow(row.rowIndex);
      }
    }
  }

  setCurrentColumn(cellIndex) {
    this.currentColumn = cellIndex;
  }

  setCurrentRow(rowIndex) {
    this.currentRow = rowIndex;
  }

  movingButtons = ({ target }) => {
    // Если курсор наведён на ячейку таблицы...
    if (target.tagName === "TD") {
      // ...сдвинуть кнопки удаления относительно неё:
      this.removeColumnButton.style.left = `${target.offsetLeft}px`;
      this.removeRowButton.style.top = `${target.offsetTop}px`;
      this.setCurrentColumn(target.cellIndex);
      this.setCurrentRow(target.parentNode.rowIndex);
    }
  };

  visibleButtons = ({ target }) => {
    // Найти ближайшую таблицу или кнопку удаления,
    // и если они есть рядом, отображать кнопки удаления.
    const closestTable = target.closest(`.${this.containerName}-table`);
    const closestButton = target.closest(
      `.${this.containerName}-remove-buttons`
    );

    if (closestTable || closestButton) {
      this.showButtons();
    }

    if (!closestTable && !closestButton) {
      this.hideButtons();
    }
  };

  createCell() {
    for (let i = 0; i < this.table.rows.length; i++) {
      this.table.rows[i].insertCell();
    }
  }

  createRow() {
    this.table.insertRow();

    for (let i = 0; i < this.table.rows[0].cells.length; i++) {
      this.table.rows[this.table.rows.length - 1].insertCell(i);
    }
  }

  deleteCell({ target }) {
    // В каждой строке таблицы...
    for (let i = 0; i < this.table.rows.length; i++) {
      this.table.rows[i].deleteCell(this.currentColumn);
    }
    // Найти "координаты" последней ячейки нулевой строки:
    const allCells = this.table.rows[0].cells;
    const lastCellOffsetLeft = allCells[allCells.length - 1].offsetLeft;
    // И если кнопка при удалении столбца оказывается вне таблицы,
    // она передвигается к крайнему столбцу. Если при удалении столбца
    // кнопка остается внутри таблицы, она просто остается на месте.
    if (target.offsetLeft > lastCellOffsetLeft) {
      this.removeColumnButton.style.left = `${lastCellOffsetLeft}px`;
    }
    // Если в таблице остаётся последний столбец,
    // убрать отображение кнопок удаления:
    if (this.table.rows[0].cells.length <= 1) {
      this.displayNoneButtons();
    }
    // (ВАЖНОЕ ПОСЛЕДНЕЕ ИСПРАВЛЕНИЕ)
    // После клика обновить значение this.currentColumn, иначе
    // оно будет равняться 0, из-за чего будет постоянно
    // удаляться первая (нулевая) строка, а не выбранная.
    this.findCurrentCell();
  }

  deleteRow({ target }) {
    // Удалить строку, на которую наведён курсор:
    this.table.deleteRow(this.currentRow);
    // Найти "координаты" последней строки в таблице:
    const allRows = this.table.rows;
    const lastRow = allRows[allRows.length - 1].offsetTop;
    // И если кнопка при удалении строки оказывается вне таблицы,
    // она передвигается к крайней строке. Если при удалении строки
    // кнопка остается внутри таблицы, она просто остается на месте.
    if (target.offsetTop > lastRow) {
      this.removeRowButton.style.top = `${lastRow}px`;
    }
    // Если в таблице остаётся последняя строка,
    // убрать отображение кнопок удаления:
    if (this.table.rows.length <= 1) {
      this.displayNoneButtons();
    }
    // (ВАЖНОЕ ПОСЛЕДНЕЕ ИСПРАВЛЕНИЕ)
    // После клика обновить значение this.currentRow, иначе
    // оно будет равняться 0, из-за чего будет постоянно
    // удаляться первая (нулевая) строка, а не выбранная.
    this.findCurrentRow();
  }

  showButtons = () => {
    if (this.table.rows.length > 1) {
      this.removeRowButton.style.visibility = "visible";
      this.removeRowButton.style.display = "block";
      this.removeRowButton.style.opacity = 1;
    }

    if (this.table.rows[0].cells.length > 1) {
      this.removeColumnButton.style.visibility = "visible";
      this.removeColumnButton.style.display = "block";
      this.removeColumnButton.style.opacity = 1;
    }
  };

  hideButtons = () => {
    this.removeRowButton.style.visibility = "hidden";
    this.removeColumnButton.style.visibility = "hidden";
    this.removeRowButton.style.opacity = 0;
    this.removeColumnButton.style.opacity = 0;
  };

  displayNoneButtons = () => {
    this.removeRowButton.style.display = "none";
    this.removeColumnButton.style.display = "none";
  };
}

// При создании таблицы колонки и строки должны быть числами > 0,
// а имя контейнера (третье значение) - строкой.
const TestTable1 = new Table(4, 4, "first");
const TestTable2 = new Table(4, 4, "second");
