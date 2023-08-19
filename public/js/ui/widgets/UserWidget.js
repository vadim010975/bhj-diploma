/**
 * Класс UserWidget отвечает за
 * отображение информации о имени пользователя
 * после авторизации или его выхода из системы
 * */

class UserWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    if (document.body.contains(element)) {
      this.element = element;
    } else {
      throw new Error('Ошибка! Переданный элемент не существует!');
    }
  }

  /**
   * Получает информацию о текущем пользователе
   * с помощью User.current()
   * Если пользователь авторизован,
   * в элемент .user-name устанавливает имя
   * авторизованного пользователя
   * */
  update(){
    const currentUser = User.current();
    const userNameElement = this.element.querySelector('.user-name');
    if (currentUser && userNameElement) {
      userNameElement.textContent = currentUser.name;
    }
  }
}
