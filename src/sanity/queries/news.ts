import groq from 'groq';
import { sanityClient } from '../sanity.client';

const newsFields = `
    ...,
    title,
    slug,
    date,
    excerpt,
    content,
    "author": author->{name, image},
    "image": image.asset->url,
    "category": category->{name,_id}
`;
// exclude drafts
export const fetchNewsCategories = sanityClient.fetch(`*[_type == "news-category" && !(_id in path("drafts.**"))]`);

export const fetchNewsQuery = groq`*[_type == "news" && !(_id in path("drafts.**"))] | order(date desc) {
    ${newsFields}
}`;
export const fetchNews = sanityClient.fetch(fetchNewsQuery);

export const fetchLatestNewsQuery = groq`*[_type == "news" && !(_id in path("drafts.**"))] | order(date desc) {
    ${newsFields}
}[0...3]`;
export const fetchLatestNews = sanityClient.fetch(fetchLatestNewsQuery);

export const fetchNewsBySlugQuery = groq`*[_type == "news" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${newsFields}}`;
export const fetchNewsBySlug = (slug: string) => sanityClient.fetch(fetchNewsBySlugQuery, { slug });

export const fetchNewsSlugsQuery = groq`*[_type == "news" && defined(slug.current)][].slug.current`;
export const fetchNewsSlugs = sanityClient.fetch(fetchNewsSlugsQuery);

export const fetchNewsByAuthorQuery = groq`*[_type == "news" && author._ref == $id]{
    ${newsFields}
}`;
export const fetchNewsByCategoryQuery = groq`*[_type == "news" && category._ref == $id | order(date desc){
    ${newsFields}
}`;
export const fetchNewsByAuthor = (id: string) => sanityClient.fetch(fetchNewsByAuthorQuery, { id });

export const fetchNewsByCategory = (id: string) => sanityClient.fetch(fetchNewsByCategoryQuery, { id });

export const fetchNewsByIdQuery = groq`*[_type == "news" && _id == $id && !(_id in path("drafts.**"))][0]{
    ${newsFields}
}`;
export const fetchNewsById = (id: string) => sanityClient.fetch(fetchNewsByIdQuery, { id });
