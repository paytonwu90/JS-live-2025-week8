const primaryColor = '#6A33FF';

function showSuccessAlert(title, message = '') {
  return Swal.fire({
    icon: "success",
    title: title,
    text: message,
    width: '16rem',
    showConfirmButton: false,
    timer: 1200,
    customClass: {
      title: 'alertTitle',
    }
  });
}

function showErrorAlert(title, message = '') {
  return Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonColor: primaryColor,
    customClass: {
      title: 'alertTitle',
    }
  });
}

function showConfirmAlert(title, message = '') {
  return Swal.fire({
    icon: "warning",
    title: title,
    text: message,
    showCancelButton: true,
    confirmButtonColor: primaryColor,
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    width: '28rem',
    customClass: {
      title: 'alertTitle',
    }
  });
}

export { showSuccessAlert, showErrorAlert, showConfirmAlert };