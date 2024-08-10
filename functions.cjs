function replacePlaceholders(template, params) {
  let result = template;
  for (const key in params) {
    if (result.includes(`__${key}__`)) {
      result = result.replace(`__${key}__`, params[key]);
    }
  }
  return result;
}

function replaceQueryParamsOnPlaceholder(template, queryParams) {
  let result = template;
  queryParams.forEach((item) => {
    //console.log(`key: ${item.key}, value: ${item.value}`);
    const placeholder = `__${item.key}__`;
    if (template.includes(placeholder)) {
      result = result.replace(new RegExp(placeholder, "g"), item.value);
    }
  });
  return result;
}

module.exports = { replacePlaceholders, replaceQueryParamsOnPlaceholder };
//export { replacePlaceholders, replaceQueryParamsOnPlaceholder };
