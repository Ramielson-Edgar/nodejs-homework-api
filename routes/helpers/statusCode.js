const httpStatusCode = {
  ok: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const getColletction = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

module.exports = {
  httpStatusCode,
  getColletction,
};
