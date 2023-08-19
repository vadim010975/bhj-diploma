/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE && xhr.status === 200) {
        options.callback(null, xhr.response);
      }
    }
    let formData = '';
    let request;
    if (options.method === 'GET') {
      request = options.url + '?';
      for (let key in options.data) {
        request += key + '=' + options.data[key] + '&';
      }
      request = request.slice(0, -1);
    } else {
      request = options.url;
      formData = new FormData;
      for (let key in options.data) {
        formData.append(key, options.data[key]);
      }
    }
    xhr.open(options.method, request);
    xhr.send(formData);
  } catch (error) {
    options.callback(error, null);
  }
};
