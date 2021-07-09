import { CATALOG_TAB } from "../constants/index";
import { ICatalog } from "../models/gamesModel";

const setInitialState = (): ICatalog => ({
  asc: false,
  filterDrawer: false,
  games: [],
  hasMoreItems: true,
  hasMoreItemsWishList: true,
  idLabelFilter: null,
  importDrawer: false,
  labels: [],
  loading: true,
  platforms: [],
  source: [],
  sourceFiltered: [],
  sourceWishList: [],
  tab: CATALOG_TAB,
  wishList: [],
});

export default setInitialState;
