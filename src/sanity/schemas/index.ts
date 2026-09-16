import author from './documents/author';
import className from './documents/class';
import gallery from './documents/gallery';
import leaderTitle from './documents/leaderTitle';
import maintainer from './documents/maintainer';
import news from './documents/news';
import club from './documents/club';
import profileRequest from './documents/profile-request';
import project from './documents/project';
import promotion from './documents/promotion';
import staff from './documents/staff';
import staffRole from './documents/staffRole';
import student from './documents/student';
import timeline from './documents/timeline';
import blockContent from './objects/blockContent';
import galleryImage from './objects/galleryImage';
import link from './objects/link';
import socials from './objects/socials';
import occupation from './documents/occupation';
import newsCategory from './documents/news-category';

const objects = [blockContent, socials, link, galleryImage];
const documents = [
   promotion,
   student,
   project,
   timeline,
   staff,
   staffRole,
   className,
   author,
   maintainer,
   news,
   profileRequest,
   leaderTitle,
   gallery,
   club,
   occupation,
   newsCategory,
];

export const schemaTypes = [...objects, ...documents];
