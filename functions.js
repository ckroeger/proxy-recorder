function replacePlaceholders(template, params) {
  let result = template;
  for (const key in params) {
    if (result.includes(`__${key}__`)) {
      result = result.replace(`__${key}__`, params[key]);
    }
  }
  return result;
}

export { replacePlaceholders };
