/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

//const { application } = require("express");

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (document.body.contains(element)) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error('Ошибка! Переданный элемент не существует!');
    }

  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createIncomeButtonElement = this.element.querySelector('.create-income-button');
    if (createIncomeButtonElement) {
      createIncomeButtonElement.addEventListener('click', () => {
        App.getModal('newIncome').open();
        App.getForm('createIncome').setSelected();
      });
    }
    const createExpenseButton = this.element.querySelector('.create-expense-button');
    if (createExpenseButton) {
      createExpenseButton.addEventListener('click', () => {
        App.getModal('newExpense').open();
        App.getForm('createExpense').setSelected();
      });
    }
  }
}
