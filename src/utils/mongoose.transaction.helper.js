import mongoose from "mongoose";

/**
 * Wraps an operation inside a mongoose transaction.
 * @param cb - async function that takes a session.
 * @return {Promise<any>}result of the operation
 */

async function transactionsHelper(cb) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const respond = await cb(session);
    await session.commitTransaction();

    return respond;
  } catch (error) {
    await session.abortTransaction();
    // next(error);
    throw error;
  } finally {
    await session.endSession();
  }
}

export default transactionsHelper;
