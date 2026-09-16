import { Metadata } from 'next';

interface Opts {
   key?: string;
   baseMeta: Metadata;
}
/**
 * This function gets the metadata of a page even it protected to avoid login preview in shared links.
 *
 * ***It has to be called at the top level of the AuthProvider in order to work as expected***
 * @param page
 */
export const getPageMetadata = async (page: string, opts: Opts) => {};
