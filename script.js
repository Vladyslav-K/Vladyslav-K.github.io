class Table {
  constructor(column, rows, containerClassName) {
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

    this.containerName = containerClassName;

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

    this.addRowButton.addEventListener("click", () => this.createRow());
    this.addColumnButton.addEventListener("click", () => this.createCell());
    this.removeRowButton.addEventListener("click", () => this.deleteRow());
    this.removeColumnButton.addEventListener("click", () => this.deleteCell());

    this.container.addEventListener("mouseover", e => this.movingButtons(e));
    document.body.addEventListener("mouseover", e => this.visibleButtons(e));

    for (let row = 0; row < rows; row++) {
      const addRow = this.table.insertRow(row);

      for (let cells = 0; cells < column; cells++) {
        addRow.insertCell(cells);
      }
    }
  }

  movingButtons = ({ target }) => {
    if (target.tagName === "TD") {
      this.removeColumnButton.style.left = `${target.offsetLeft}px`;
      this.removeRowButton.style.top = `${target.offsetTop}px`;
      this.currentCellIndex = target.cellIndex;
      this.currentRowIndex = target.parentNode.rowIndex;
    }
  };

  visibleButtons = ({ target }) => {
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

  deleteCell() {
    let rows = this.table.rows;

    const cells = rows[0].cells;
    const lastCellIndex = cells.length - 1;

    for (let i = 0; i < rows.length; i++) {
      rows[i].deleteCell(this.currentCellIndex);
    }
    // If the deleted column is the last in the row,
    // the delete button moves to the column that will now be the last:
    if (this.currentCellIndex == lastCellIndex) {
      const lastCellOffsetLeft = cells[lastCellIndex - 1].offsetLeft;
      this.removeColumnButton.style.left = `${lastCellOffsetLeft}px`;
      //
      this.currentCellIndex--;
    }

    if (rows[0].cells.length <= 1) {
      this.removeColumnButton.style.display = "none";
    }
  }

  deleteRow() {
    const rows = this.table.rows;
    const lastRowIndex = rows.length - 1;

    this.table.deleteRow(this.currentRowIndex);
    // If the deleted row is the last in the table,
    // the delete button moves to the row that will now be the last:
    if (this.currentRowIndex == lastRowIndex) {
      const lastRowOffset = rows[rows.length - 1].offsetTop;
      this.removeRowButton.style.top = `${lastRowOffset}px`;
      this.currentRowIndex--;
    }

    if (rows.length <= 1) {
      this.removeRowButton.style.display = "none";
    }
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
}

const TestTable1 = new Table(4, 4, "first");
const TestTable2 = new Table(4, 4, "second");
