/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления самого счёта.
   * Внутри обработчика пользуйтесь методом
   * TransactionsPage.removeAccount
   * */
  registerEvents() {
    const removeAccountElement = this.element.querySelector('.remove-account');
    if (removeAccountElement) {
      removeAccountElement.addEventListener('click', () => {
        this.removeAccount();
      });
    }

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions?.account_id) {
      const result = confirm('Вы действительно хотите удалить счёт?');
      if (result) {
        Account.remove({ id: this.lastOptions.account_id }, (err, res) => {
          const response = JSON.parse(res);
          if (handleError(err, response)) {
            App.updateWidgets();
            App.updateForms();
          }
        });
        this.clear();
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (id) {
      const result = confirm('Вы действительно хотите удалить эту транзакцию?');
      if (result) {
        Transaction.remove({ id: id }, (err, res) => {
          if (!err && JSON.parse(res).success) {
            this.update();
            App.getWidget("accounts").update();
          }
        });
      }
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options?.account_id) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, res) => {
        const response = JSON.parse(res);
        if (!err && response.success) {
          this.renderTitle(response.data.name);
        }
      });
      Transaction.list(options, (err, res) => {
        const response = JSON.parse(res);
        if (!err && response.success) {
          this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitleElement = this.element.querySelector('.content-title');
    if (name && contentTitleElement) {
      contentTitleElement.textContent = name;
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric'
    };
    return (new Date(date).toLocaleString('default', options));
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * Отслеживает нажатие на кнопку удаления транзакции
   * Внутри обработчика пользуйтесь
   * методом TransactionsPage.removeTransaction
   * */
  getTransactionHTML(item) {
    if (item) {
      const transactionElement = document.createElement('div');
      transactionElement.classList.add('transaction', 'transaction_' + item.type, 'row');
      transactionElement.innerHTML = `
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <!-- дата -->
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <!-- в data-id нужно поместить id -->
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>`;
      transactionElement.querySelector('.transaction__remove').addEventListener('click', e => {
        this.removeTransaction(e.currentTarget.dataset.id);
      });
      return transactionElement;
    }
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentElement = this.element.querySelector('.content');
    if (contentElement) {
      contentElement.innerHTML = '';
      data.forEach(el => {
        const html = this.getTransactionHTML(el);
        contentElement.append(html);
      });
    }
  }
}