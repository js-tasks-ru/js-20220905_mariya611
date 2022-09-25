export default class SortableTable {
  subElements = {};
  element;

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };
      return orders[order];
    };

    if (column) {
      const {id, order} = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  };


  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = true;


    this.render();
  }


  render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTable(sortedData);

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initListeners();
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  getHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
            </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
          <span>${title}</span>
          ${this.getHeaderSortingArrow(id)}
          </div>`;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTable(data) {
    return `
    <div class="sortable-table">
    ${this.getHeader()}
    ${this.getTableBody(data)}
    </div>`;
  }

  getTableBody(data) {
    return `
    <div data-element="body" class="sortable-table__body">
    ${this.getTableRows(data)}
    </div>`;
  }


  getTableRows(data) {
    return data.map(dataItem => {
      return `
        <a href="/products/${dataItem.id}" class="sortable-table__row">
        ${this.getTableRow(dataItem)}
        </a>`;
    }).join("");
  }

  getTableRow(dataItem) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cells.map(({id, template}) => {
      return template
        ? template(dataItem[id])
        : `<div class= "sortable-table__cell" >${dataItem[id]}</div>`;
    }).join('');
  }


  sortData(fieldValue = 'title', orderValue = 'asc') {
    const res = [...this.data];
    const column = this.headerConfig.find(item => item.id === fieldValue);
    const {sortType, customSorting} = column;

    const direction = orderValue === 'asc' ? 1 : -1;


    return res.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[fieldValue] - b[fieldValue]);
      case 'string':
        return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru-RU', 'en-US'], {caseFirst: 'upper'});
      default :
        return direction * (a[fieldValue] - b[fieldValue]);
      }
    });
  }


  getSubElements(element) {
    const res = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      res[name] = subElement;
    }
    return res;
  }

  initListeners() {
    const header = this.element.querySelector('.sortable-table__header');
    header.addEventListener('pointerdown', this.onSortClick);
  }
}
