import { notify } from 'notiwind';

function error(options) {
  return notify(
    {
      ...options,
      title: options.title || 'Error',
      type: 'error'
    },
    options.timeout || 5000
  );
}

function success(options) {
  return notify(
    {
      ...options,
      title: options.title || 'Success',
      type: 'success'
    },
    options.timeout || 5000
  );
}

// FIXME: add error processor
function processError(error, result) {
  const text = error || result;
  return text;
}

export {
  error,
  success,
  processError,
  notify
};
