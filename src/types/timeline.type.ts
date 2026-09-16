export interface Asset {
   _id: string;
   url: string;
}

export interface Image {
   asset: Asset;
   alt: string;
}

export interface Timeline {
   title: string;
   description: string;
   url: string;
   image: Image;
   time: string;
}

export interface TimelineModel {
   title: string;
   cardTitle: string;
   url: string;
   cardSubtitle: string;
   cardDetailedText: string;
   imageUrl: string;
}
