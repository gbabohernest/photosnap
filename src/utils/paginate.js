async function paginate(model, req, options = {}) {
  const {
    filter = {},
    select = "",
    sort = {},
    searchFields = [],
    virtual = null,
  } = options;

  const page = Math.max(1, parseInt(req.query?.page)) || 1;
  const limit = Math.min(20, Math.max(1, parseInt(req.query?.limit))) || 5;

  const skip = (page - 1) * limit;

  let dbQuery = model.find(filter);

  if (req.query.search && searchFields.length > 0) {
    const rawSearchTerms = req.query.search;
    const phrases = rawSearchTerms
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (phrases.length > 0) {
      dbQuery = dbQuery.or(
        phrases.flatMap((phrase) =>
          searchFields.map((field) => ({
            [field]: { $regex: phrase, $options: "i" },
          })),
        ),
      );
    } else {
      dbQuery = dbQuery.where({ _id: null });
    }
  }

  dbQuery = dbQuery.sort(sort);

  if (select) {
    dbQuery = dbQuery.select(select);
  }

  if (virtual) {
    dbQuery = dbQuery.populate(virtual, "username avatar  -_id");
  }

  dbQuery = dbQuery.skip(skip).limit(limit);

  const [data, totalItems] = await Promise.all([
    dbQuery,
    model.countDocuments(dbQuery),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    nbHits: totalItems,
    currentPage: page,
    numberOfPages: totalPages,
    limit,
    data,
  };
}

export default paginate;
