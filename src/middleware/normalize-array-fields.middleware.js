/**
 * Middleware to normalize specified fields as array in req.body.
 * Ensures that fields value is an array before validation
 *
 * @param fields - List of field names
 * @returns {(function(*, *, *): void)|*}
 */
function normalizeArrayFields(fields) {
  return (req, res, next) => {
    if (req.body) {
      for (const fieldName of fields) {
        if (!(fieldName in req.body)) continue;

        const value = req.body[fieldName];

        if (typeof value === "string") {
          req.body[fieldName] = [value];
        }
      }
    }

    next();
  };
}

export default normalizeArrayFields;
