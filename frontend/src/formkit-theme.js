// We'll create some re-useable definitions
// because many input types are identical
// in how we want to style them.
const textClassification = {
  label: 'block mb-1 font-bold text-sm',
  inner: `
    border-2
    border-gray-300
    formkit-invalid:border-red-500
    rounded-xl mb-3
    overflow-hidden
    formkit-invalid:ring-red-500/50
  `,
  input:
    'w-full h-10 px-3 border-none text-base text-gray-700 placeholder:text-gray-300 placeholder:text-sm'
};
const boxClassification = {
  fieldset: 'border-2 border-gray-300 rounded-md px-2 pb-1',
  legend: 'font-bold text-sm',
  wrapper: 'flex items-center mb-1 cursor-pointer',
  help: 'mb-2',
  input:
    'form-check-input appearance-none h-5 w-5 mr-2 border-2 border-gray-500 rounded-sm bg-white checked:bg-primary focus:checked:bg-primary hover:checked:bg-primary transition duration-200 cursor-pointer',
  label: 'text-sm text-gray-700 mt-1'
};
const buttonClassification = {
  wrapper: 'mb-1',
  input:
    'inline-flex items-center justify-center px-8 py-4 bg-primary hover:opacity-80 hover:shadow-inner border-2 border-primary rounded-xl text-sm font-bold leading-none text-white'
};

// export our definitions using our above
// templates and declare one-offs and
// overrides as needed.
export default {
  // the global key will apply to all inputs
  global: {
    outer: 'mb-5 formkit-disabled:opacity-50',
    help: 'text-xs text-gray-500',
    messages: 'list-none p-0 mt-1 mb-0',
    message: 'text-red-500 mb-1 text-xs'
  },
  button: buttonClassification,
  color: {
    label: 'block mb-1 font-bold text-sm',
    input:
      'w-16 h-8 appearance-none cursor-pointer border border-gray-300 rounded-md mb-2 p-1'
  },
  date: textClassification,
  'datetime-local': textClassification,
  checkbox: boxClassification,
  email: textClassification,
  file: {
    label: 'block mb-1 font-bold text-sm',
    inner: 'cursor-pointer',
    input:
      'text-gray-600 text-sm mb-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-white hover:file:opacity-80 hover:file:shadow-inner hover:file:cursor-pointer',
    noFiles: 'block text-gray-800 text-sm mb-1',
    fileItem: 'block flex text-gray-800 text-sm mb-1',
    removeFiles: 'ml-auto text-primary text-sm'
  },
  month: textClassification,
  number: textClassification,
  password: textClassification,
  radio: {
    // if we want to override a given sectionKey
    // we can do a spread of the default value
    // along with a new definition for our target.
    ...boxClassification,
    input: boxClassification.input.replace('rounded-sm', 'rounded-full')
  },
  range: {
    inner: '',
    input:
      'form-range appearance-none w-full h-2 p-0 bg-gray-200 rounded-full'
  },
  search: textClassification,
  select: textClassification,
  submit: buttonClassification,
  tel: textClassification,
  text: textClassification,
  textarea: {
    ...textClassification,
    input: textClassification.input + ' !h-32'
  },
  time: textClassification,
  url: textClassification,
  week: textClassification
};
