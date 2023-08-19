/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, res) => {
      const response = JSON.parse(res);
      const accountsListElement = this.element.querySelector('.accounts-select');
      if (handleError(err, response) && accountsListElement) {
        accountsListElement.innerHTML = '';
        response.data.forEach(el => {
          accountsListElement.insertAdjacentHTML('beforeend', `<option value="${el.id}">${el.name}</option>`);
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, res) => {
      const response = JSON.parse(res);
      if (handleError(err, response)) {
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update();
      }
      this.element.reset();
    });
  }

  setSelected() {
    const id = App.getWidget('accounts').activeAccountId;
    const accountsListElement = this.element.querySelector('.accounts-select');
    if (!id || !accountsListElement) {
      return;
    }
    accountsListElement.querySelectorAll('option').forEach(el => {
      if (el.value === id) {
        el.setAttribute('selected', 'selected');
      } else {
        el.removeAttribute('selected');
      }
    });
  }
}