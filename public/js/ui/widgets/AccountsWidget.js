/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

//const { application } = require("express");

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (document.body.contains(element)) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw new Error('Ошибка! переданный элемент не существует!');
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * */
  registerEvents() {
    const accountElement = this.element.querySelector('.create-account');
    if (accountElement) {
      accountElement.addEventListener('click', () => {
        App.getModal('createAccount').open();
      });
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (currentUser) {
      Account.list(currentUser, (err, res) => {
        const response = JSON.parse(res);
        if (handleError(err, response)) {
          this.clear();
          this.renderItem(response.data);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountElements = this.element.querySelectorAll('.account');
    if (accountElements.length) {
      accountElements.forEach(el => {
        el.remove();
      });
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(el) {
    const accountElements = this.element.querySelectorAll('.account');
    if (accountElements.length) {
      accountElements.forEach(element => {
        element.classList.remove('active');
      });
      el.classList.add('active');
      this.activeAccountId = el.dataset.id;
      App.showPage('transactions', { account_id: el.dataset.id });
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  getAccountHTML(item) {
    const accountElement = document.createElement('li');
    accountElement.classList.add('account');
    if (this.activeAccountId && item.id === this.activeAccountId) {
      accountElement.classList.add('active');
    }
    accountElement.dataset.id = item.id;
    accountElement.innerHTML = `<a href="#">
      <span>${item.name}</span>
      <span>${item.sum}</span>
    </a>`;
    accountElement.addEventListener('click', e => {
      e.preventDefault();
      this.onSelectAccount(e.currentTarget);
    });
    return accountElement;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    if (data?.length) {
      data.forEach(el => {
        this.element.append(this.getAccountHTML(el));
      });
    }
  }
}
