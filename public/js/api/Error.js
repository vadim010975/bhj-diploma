const handleError = (error, response) => {
  if (!error && response.success) {
    return true;
  } else if (response.error) {
    console.error(response.error);
    return false;
  } else {
    console.error(error.message);
    return false;
  }
}
