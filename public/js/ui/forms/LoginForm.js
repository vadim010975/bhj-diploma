/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, res) => {
      const response = JSON.parse(res);
      if (handleError(err, response)) {
        App.setState('user-logged');
      }
      this.element.reset();
      App.getModal('login').close();
    });
  }
}