export interface IListingLocation {
  type?: string;
  coordinates?: number[];
  address?: string;
}

export interface IPublishedListingOption {
  _id: string;
  title: string;
  country?: string;
  city?: string;
  postalCode?: string;
  location?: IListingLocation;
}

export interface IPopularLocation {
  _id?: string;
  id?: string;
  name: string;
  image: string;
  listings: (string | { _id: string; title?: string; location?: IListingLocation })[];
}

export type TPopularLocationCreatePayload = {
  name: string;
  image?: string;
  listings: string[];
};

export type TPopularLocationUpdatePayload = {
  name: string;
  listingIds: string[];
};
