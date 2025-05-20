import mongoose from "mongoose";

/**
 * A helper function for database operations.
 * Operations that changes the state of our database (write operations)
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
