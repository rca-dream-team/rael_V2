import { groq } from 'next-sanity';

export const getAllTimeline = groq`*[_type == "timeline"] | order(time desc) {
    title,
    description,
    url,
    image {
        asset -> {
            _id,
            url
        },
        alt
        },
    time
  }`;
