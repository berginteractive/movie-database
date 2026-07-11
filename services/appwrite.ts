// track the searches made by a user
import { Client, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tablesDB = new TablesDB(client);

// Derives a stable rowId from the search term so concurrent searches for the
// same query always target the same row, instead of racing between a
// listRows lookup and a subsequent createRow/updateRow.
const getSearchRowId = (query: string) => {
  const normalized = query.trim().toLowerCase();
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    hash1 = (hash1 * 33) ^ code;
    hash2 = (hash2 * 33) ^ code;
  }
  return `search_${(hash1 >>> 0).toString(36)}${(hash2 >>> 0).toString(36)}`;
};

export const updateSearchCount = async (query: string, movie: Movie) => {
  const rowId = getSearchRowId(query);

  try {
    await tablesDB.incrementRowColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId,
      column: "count",
    });
    return;
  } catch (error) {
    if (!(error instanceof Error) || (error as any).code !== 404) {
      logSearchCountError(error);
      return;
    }
  }

  // Row didn't exist yet for this search term - create it. upsertRow is
  // idempotent on rowId, so concurrent first-time searches for the same
  // query cannot create duplicate rows.
  try {
    await tablesDB.upsertRow({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      rowId,
      data: {
        searchTerm: query,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        movie_id: movie.id,
        title: movie.title,
      },
    });
  } catch (error) {
    logSearchCountError(error);
  }
};

// This is a non-critical analytics side effect - never let it surface as an
// unhandled rejection to callers, and avoid logging the raw Appwrite error
// (it can include request/response details) beyond a short message.
const logSearchCountError = (error: unknown) => {
  console.log(
    "updateSearchCount failed:",
    error instanceof Error ? error.message : "unknown error",
  );
};
