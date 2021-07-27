export interface IActionType {
  type: string;
  payload?: Object;
}

export interface IPlatform {
  id: number;
  name: string;
}

export interface ICatalog {
  asc: boolean;
  error?: boolean;
  filterDrawer: boolean;
  games: IGame[];
  hasMoreItems: boolean;
  hasMoreItemsWishList: boolean;
  idLabelFilter?: string | null;
  importDrawer: boolean;
  labels: string[];
  loading: boolean;
  platforms: IPlatform[];
  source: IGame[];
  sourceFiltered: Object[];
  sourceWishList: Object[];
  tab?: number;
  wishList: Object[];
  [key: string]: string | boolean | Object | null | [] | undefined;
}

export interface IGames {
  Game: IGame[];
  GameLabel: IGameLabel[];
  Label: ILabel[];
  Platform: Object[];
}

export interface IGame {
  id: number;
  name: string;
  labels?: ILabel[];
  is_wishlist_item?: boolean;
  created_on?: string;
  updated_on?: string;
  description?: string;
  description_short?: string;
  image_url_large?: string;
  image_url_medium?: string;
  image_url_small?: string;
  image_url_thumb?: string;
  platform_id?: number;
  release_date?: string;
  region_id?: number;
  mc_score_updated_on?: string;
  hltb_main_story?: number;
  hltb_main_story_updated_on?: string;
  collector_has_digital?: boolean;
  hltb_json?: string;
  igdb_id?: number;
}

export interface IGameLabel {
  game_id: number;
  label_id: number;
}

export interface ILabel {
  id: number;
}

export interface IProp {
  source: IGame[];
  propGames: string;
  propMoreItems: string;
}
