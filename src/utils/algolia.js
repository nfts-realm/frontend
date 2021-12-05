import algoliasearch from "algoliasearch";

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
// const ALGOLIA_API_KEY = "f9d53c77729127d3156d9a2d4bd46827";

const ALGOLIA_API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;

export const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY, {
  protocol: "https:",
});
export const algolia = client.initIndex("users");
