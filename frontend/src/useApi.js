import { ref } from 'vue';

export const isLoading = ref(false);

// FIXME: add fetch timeout and may be retry

const Loader = {
  timeout: null,
  count: 0,
  start(_timeout = Config.timeout) {
    clearTimeout(this.timeout);
    if (_timeout) {
      this.timeout = setTimeout(() => {
        isLoading.value = true;
      }, _timeout);
    } else {
      isLoading.value = true;
    }
    this.count++;
  },
  stop() {
    this.count--;
    if (this.count) {
      return;
    }
    clearTimeout(this.timeout);
    isLoading.value = false;
  }
}

let Config = {
  /// API prefix
  prefix: null,
  /// Loader show timeout
  timeout: 500,
  /// Error calback
  onError: null,
  /// Success calback
  onSuccess: null
}

Config = new Proxy(Config, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      throw new Error(`Undefined config property '${prop}'`);
    }
  },

  set(target, prop, val) {
    if (prop in target) {
      target[prop] = val;
      return true;
    }
    return false;
  }
});

export function configureApi(config = {}) {
  Object.entries(config).forEach(([ key, value ]) => Config[key] = value);
}

async function _fetch(url, options = {}) {

  Loader.start(options.timeout);

  if (!options.headers) {
    options.headers = {};
  }

  if (!options.headers.accept && !options.headers.Accept) {
    options.headers.accept = 'application/json';
  }

  if (!options.headers['Content-Type'] && !options.headers['content-type']) {
    options.headers['content-type'] = 'application/json';
  }

  if (!options.headers.authorization && !options.headers.Authorization) {
    const token = window.localStorage.getItem(import.meta.env.VITE_APP_LOCALSTORAGE_KEY_NAME);
    if (token) {
      options.headers.authorization = 'Bearer ' + token + '1';
    }
  }

  const onError = options.onError ?? Config.onError;

  const _url = (options.prefix ?? Config.prefix) + url;

  const response = await fetch(_url, options);

  if (response.ok) {
    const result = await response.json();
    if (result.success) {
      Loader.stop();

      const onSuccess = options.onSuccess ?? Config.onSuccess;
      if (typeof onSuccess === 'function') {
        onSuccess(result);
      }

      return result;
    }

    Loader.stop();
    if (typeof onError === 'function') {
      onError(null, result);
    }
    return { error: 'Serverside error' };
  }

  let details = await response.text();
  try {
    details = JSON.parse(details);
  } catch (error) {
    // do nothing
  }

  Loader.stop();
  if (typeof onError === 'function') {
    onError(details, null);
  }
  return { error: details || true };
}

export async function get(url, data = null, options = {}) {
  options.method = 'GET';
  let searchParams = '';
  if (data) {
    searchParams = '?' + new URLSearchParams(data);
  }
  return _fetch(url + searchParams, options);
}

export async function post(url, data = null, options = {}) {
  options.method = 'POST';
  options.body = data ? JSON.stringify(data) : undefined;

  return _fetch(url, options);
}

export async function put(url, data = null, options = {}) {
  options.method = 'PUT';
  options.body = data ? JSON.stringify(data) : undefined;

  return _fetch(url, options);
}
