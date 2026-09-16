export interface Gallery {
   _id: string;
   name: string;
   description: string;
   coverImage: ImageAsset;
   images: ImageAsset[];
}

export interface ImageAsset {
   _upload: any;
   _type: string;
   _key: string;
   asset: Asset;
}

export interface Asset {
   _ref: string;
   _type: string;
}

export interface Image {
   image: ImageAsset;
   title: any;
   caption: any;
   shotBy?: any;
}
