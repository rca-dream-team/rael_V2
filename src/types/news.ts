export interface News {
   commentQuestion: string;
   _id: string;
   title: string;
   slug: Slug;
   date: string;
   excerpt: string;
   content: Content[];
   image: string;
   category: NewsCategory;
}

export interface Slug {
   _type: string;
   current: string;
}

export interface Content {
   _key: string;
   markDefs?: any[];
   children?: Children[];
   _type: string;
   style?: string;
   asset?: Asset;
   listItem?: 'bullet' | 'number';
}
export interface NewsCategory {
   _ref: string;
   _type: string;
   _id: string;
   classified: boolean;
   name: string;
   order: number;
}

export interface Children {
   _key: string;
   _type: string;
   marks: string[];
   text: string;
}

export interface Asset {
   _ref: string;
   _type: string;
}
