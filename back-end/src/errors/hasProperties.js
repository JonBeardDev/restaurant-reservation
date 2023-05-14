/**
 * Confirms a list of properties exists in the req.body
 * @param  {...any} properties 
 * An array of property names
 * @returns 
 * next(), if the property exists, or throws a 400 error if it does not
 */
function hasProperties(...properties) {
  return function (res, req, next) {
    const { data = {} } = res.body;

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = hasProperties;
