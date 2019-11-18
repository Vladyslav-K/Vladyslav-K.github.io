class Table {
  constructor(columns, rows) {
    // Create element to view error:
    const _error = document.createElement("div");
    _error.className = "error";
    _error.innerHTML = `<h1>Ошибка</h1>
      <h2>Пожалуйста, введите корректные начальные данные таблицы!
      <br/>
      Значения строк и колонок должны быть числами больше нуля!
      </h2>`;

    // Validating data values. If the value is incorrect, an error message is displayed:
    if (columns <= 0 || !Number.isInteger(columns)) {
      document.querySelector(".global-container").append(_error);
      throw new Error(
        "Invalid number of columns (only numbers greater than zero are accepted)"
      );
    }

    if (rows <= 0 || !Number.isInteger(rows)) {
      document.body.append(_error);
      throw new Error(
        "Invalid number of rows (only numbers greater than zero are accepted)"
      );
    }

    if (!columns || !rows) {
      document.body.append(_error);
      throw new Error("Need to pass both values - columns and rows");
    }

    this.container = document.createElement("div");
    this.container.className = "container";
    document.querySelector(".global-container").append(this.container);

    this.tableContainer = document.createElement("div");
    this.tableContainer.className = "table-container";
    this.container.append(this.tableContainer);

    this.table = document.createElement("table");
    this.tableContainer.append(this.table);

    this.addRowButton = document.createElement("div");
    this.addRowButton.className = "button add-row add";
    this.addRowButton.innerHTML = "+";
    this.container.append(this.addRowButton);

    this.addColumnButton = document.createElement("div");
    this.addColumnButton.className = "button add-column add";
    this.addColumnButton.innerHTML = "+";
    this.container.append(this.addColumnButton);

    this.removeRowButton = document.createElement("div");
    this.removeRowButton.className = "button remove-row remove";
    this.removeRowButton.innerHTML = "-";
    this.tableContainer.append(this.removeRowButton);

    this.removeColumnButton = document.createElement("div");
    this.removeColumnButton.className = "button remove-column remove";
    this.removeColumnButton.innerHTML = "-";
    this.tableContainer.append(this.removeColumnButton);

    this.addRowButton.addEventListener("click", () => this.createRow());
    this.addColumnButton.addEventListener("click", () => this.createCell());
    this.removeRowButton.addEventListener("click", () => this.deleteRow());
    this.removeColumnButton.addEventListener("click", () => this.deleteCell());

    this.container.addEventListener("mouseover", (event) =>
      this.movingButtons(event)
    );
    this.tableContainer.addEventListener("mouseenter", () =>
      this.showButtons()
    );
    this.tableContainer.addEventListener("mouseleave", () =>
      this.hideButtons()
    );

    for (let row = 0; row < rows; row++) {
      const addRow = this.table.insertRow(row);

      for (let cells = 0; cells < columns; cells++) {
        addRow.insertCell(cells);
      }
    }
  }

  movingButtons = ({ target }) => {
    if (target.tagName === "TD") {
      // Moving buttons relative to the current cell and row:
      this.removeColumnButton.style.left = `${target.offsetLeft}px`;
      this.removeRowButton.style.top = `${target.offsetTop}px`;
      this.currentCellIndex = target.cellIndex;
      this.currentRowIndex = target.parentNode.rowIndex;
    }
  };

  createCell() {
    const rows = this.table.rows;

    for (let i = 0; i < rows.length; i++) {
      rows[i].insertCell();
    }
  }

  createRow() {
    this.table.insertRow();
    const rows = this.table.rows;

    for (let i = 0; i < rows[0].cells.length; i++) {
      rows[rows.length - 1].insertCell(i);
    }
  }

  deleteCell() {
    const rows = this.table.rows;

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

// Columns and rows must be positive integers greater than zero.
const TestTable1 = new Table(4, 4);
const TestTable2 = new Table(4, 4);
