'use client';
import PromFilter from '@/components/page_comps/members/PromFilter';
import RemoveImage from '@/components/page_comps/profile/RemoveImage';
import UpdateProfilePic from '@/components/page_comps/profile/UpdateProfilePic';
import UploadImages from '@/components/page_comps/profile/UploadImages';
import AsyncSelect from '@/components/profile/AsyncSelect';
import RequestModal from '@/components/profile/RequestModal';
import { useAuth } from '@/contexts/AuthProvider';
import { getImageUrl, urlFor } from '@/sanity/sanity.client';
import { ISocial, ProfileRequest } from '@/types/member.type';
import useGet from '@/utils/hooks/useGet';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button, Input, MultiSelect, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ProfileRequestPage = () => {
   const { user } = useAuth();
   const [profileData, setProfileData] = React.useState({
      occupation: user?.occupation,
      leaderTitle: user?.leaderTitle,
      bio: user?.bio,
      socials: user?.socials,
      promotion: user?.promotion,
   });
   const [loading, setLoading] = useState(false);
   const [userRequest, setUserRequest] = useState<ProfileRequest | null>(null);
   const [showModal, setShowModal] = useState(false);
   // const [occupations, setOccupations] = useState<string[]>([]);
   const { data: occupations, loading: ocLoading } = useGet<string[]>('*[_type=="occupation"]{name}', {
      formatResponse: (res) => res.map((item: any) => item.name),
      defaultValue: [],
   });

   const handleSocialChange = (social: keyof ISocial, value: string) => {
      // //console.log('social', social, 'value', value);
      const newSocials = structuredClone(profileData.socials) || ({} as ISocial);
      newSocials[social] = { url: value, label: social };
      // //console.log('newSocials', newSocials);
      setProfileData({ ...profileData, socials: newSocials });
   };

   useEffect(() => {
      //console.log('userRequest', userRequest);
      setProfileData({
         occupation: userRequest?.occupation ?? user?.occupation ?? [],
         leaderTitle: userRequest?.leaderTitle ?? user?.leaderTitle,
         bio: userRequest?.bio ?? user?.bio,
         socials: userRequest?.socials ?? user?.socials,
         promotion: userRequest?.promotion ?? user?.promotion,
      });
   }, [user, userRequest]);

   const submitRequest = async () => {
      if (!user) return;
      setLoading(true);
      try {
         //console.log('toRequest', profileData);
         // validate social url if they are urls not any other string
         if (!profileData.socials || !profileData.socials === undefined) return;
         const isValidUrls = Object.keys(profileData.socials).every((key) => {
            return profileData?.socials?.[key as keyof ISocial].url.match(/^https?:\/\/.*/) !== null;
         });
         if (!isValidUrls) {
            notifications.show({
               color: 'red',
               title: 'Invalid Url',
               message: 'Please enter a valid url for social links',
            });
            setLoading(false);
            return;
         }
         const res = await axios.put('/api/profile/request', {
            request: profileData,
            requester: user,
         });
         // requestProfile(profileData, user);
         //console.log('response', res);
         notifications.show({
            color: 'green',
            title: 'Profile Requested',
            message: 'Profile Request Sent Successfully',
         });
         getUserRequest();
      } catch (error) {
         //console.log('__error', error);
         notifications.show({
            color: 'red',
            title: 'Request Error',
            message: 'Error Sending Profile Request',
         });
      }
      setLoading(false);
   };

   const getUserRequest = async () => {
      try {
         const res = await axios.get('/api/profile/request');
         setUserRequest(res.data?.data);
      } catch (error) {
         //console.log('error', error);
      }
   };

   useEffect(() => {
      getUserRequest();
   }, []);

   //console.log('occupations', occupations);
   //    const canAddPics = userRequest ? userRequest.isApproved : true;

   return (
      <div className="relativeflex flex-col mb-6 w-full max-w-[1000px]">
         <Link
            href={'/profile'}
            className="z-10 w-fit text-black dark:text-white flex items-center gap-3 py-2 rounded-3xl  self-center mt-6 "
         >
            <ArrowLeftIcon className="w-5" />
            View Profile
         </Link>
         <h3 className="text-xl font-bold text-center">Request profile</h3>
         {userRequest && (
            <div className="flex mx-auto justify-center">
               <span>
                  {userRequest.isApproved
                     ? 'This Request is Approved and it is now live on your profile'
                     : 'This Request is still pending approval'}
               </span>
            </div>
         )}
         <div className="relative flex flex-row align-middle mt-4">
            <div className="flex w-[300px] aspect-square relative rounded-full overflow-hidden">
               {user?.picture ? (
                  <Image
                     src={getImageUrl(user.picture)!}
                     width={300}
                     height={300}
                     className="object-cover min-h-full min-w-full"
                     alt="member"
                  />
               ) : (
                  <div className=" w-full aspect-square rounded-full border-2 justify-center flex items-center">
                     {/* <FaUserCircle className=" text-7xl cursor-pointer" /> */}
                     <UserCircleIcon className=" w-full dark:text-gray-400" />
                  </div>
               )}
               {<UpdateProfilePic />}
            </div>
            <div className="flex flex-col p-3 h-fit  flex-1 gap-4 mt-4">
               <Input.Wrapper label="Names">
                  <Input size="lg" radius="md" width={'100%'} value={user?.names} onChange={() => {}} readOnly />
               </Input.Wrapper>
               <PromFilter
                  size="lg"
                  label="current"
                  value={profileData.promotion}
                  handleChange={(val) => val && setProfileData({ ...profileData, promotion: val })}
               />
               <Input.Wrapper label="Leader Title" description={`Currently Selected: ${profileData?.leaderTitle}`}>
                  <AsyncSelect
                     query="*[_type=='leaderTitle']"
                     labelKey="title"
                     size="lg"
                     px={0}
                     value={profileData?.leaderTitle ?? ''}
                     accessorKey="title"
                     onChange={(value) => {
                        //console.log('value', value);
                        setProfileData({ ...profileData, leaderTitle: value });
                     }}
                     placeholder="Select title"
                     variant="default"
                     selectValue
                  />
               </Input.Wrapper>
            </div>
         </div>
         <div>
            <Textarea
               label="Description"
               placeholder={'Edit your Bio here ! '}
               autosize
               value={profileData?.bio ?? ''}
               minRows={2}
               onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
               maxRows={4}
               className="mt-4 "
            />
         </div>
         <div className=" mt-6 w-full ">
            <h3 className="text-xl font-bold">Occupations</h3>
            <div className="flex flex-wrap flex-row gap-6  mt-4 items-center align-middle">
               <MultiSelect
                  data={ocLoading ? [{ label: 'Loading ..', disabled: true, value: '' }] : occupations ?? []}
                  placeholder="Select your occupation"
                  value={profileData.occupation}
                  className="w-[100%]"
                  size="lg"
                  onChange={(value) => {
                     setProfileData({ ...profileData, occupation: value });
                  }}
                  searchable
                  // disabled={ocLoading}
               />
            </div>
         </div>
         <div className="mt-6 w-full">
            <h3 className="text-xl font-bold">Contacts</h3>
            <span className="text-sm text-gray-500">
               Add your social media links if available. Ignore some if you don&apos;t have it
            </span>
            <div className=" gap-6 grid p-3 lg:grid-cols-2 w-full items-center border align-middle">
               <Input.Wrapper label={'Github'}>
                  <Input
                     value={profileData.socials?.github?.url}
                     size="lg"
                     placeholder={`Enter Github Link`}
                     onChange={(e) => handleSocialChange('github', e.target.value)}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Linked In'}>
                  <Input
                     value={profileData.socials?.linkedIn?.url}
                     size="lg"
                     placeholder={`Enter Linked In Link`}
                     onChange={(e) => handleSocialChange('linkedIn', e.target.value)}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Instagram'}>
                  <Input
                     value={profileData.socials?.instagram?.url}
                     onChange={(e) => handleSocialChange('instagram', e.target.value)}
                     size="lg"
                     placeholder={`Enter Instagram Link`}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Portfolio'}>
                  <Input
                     value={profileData.socials?.portfolio?.url}
                     onChange={(e) => handleSocialChange('portfolio', e.target.value)}
                     size="lg"
                     placeholder={`Enter Portfolio Link`}
                  />
               </Input.Wrapper>
               {/* Twitter */}
               <Input.Wrapper label={'Facebook'}>
                  <Input
                     value={profileData.socials?.facebook?.url}
                     onChange={(e) => handleSocialChange('facebook', e.target.value)}
                     size="lg"
                     placeholder={`Enter Facebook Link`}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Twitter'}>
                  <Input
                     value={profileData.socials?.twitter?.url}
                     onChange={(e) => handleSocialChange('twitter', e.target.value)}
                     size="lg"
                     placeholder={`Enter Twitter Link`}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Behance'}>
                  <Input
                     value={profileData.socials?.behance?.url}
                     onChange={(e) => handleSocialChange('behance', e.target.value)}
                     size="lg"
                     placeholder={`Enter Behance Link`}
                  />
               </Input.Wrapper>
               <Input.Wrapper label={'Dribbble'}>
                  <Input
                     value={profileData.socials?.dribbble?.url}
                     onChange={(e) => handleSocialChange('dribbble', e.target.value)}
                     size="lg"
                     placeholder={`Enter Dribbble Link`}
                  />
               </Input.Wrapper>
            </div>

            <div className="flex flex-col w-full mt-4">
               <h3 className="text-xl font-bold ">Other Images</h3>
               <p className="text-sm text-gray-500">You can add more images to your profile</p>
               <div className="grid md:grid-cols-5 mt-3 sm:grid-cols-3 grid-cols-2 w-full gap-6">
                  {user?.images?.map((im, i) => (
                     <div className="w-full relative" key={i}>
                        <Image
                           src={urlFor(im).url()}
                           alt="Alt"
                           className="w-full rounded-xl overflow-hidden"
                           width={300}
                           height={300}
                           quality={100}
                        />
                        <RemoveImage image={im} />
                     </div>
                  ))}
                  <UploadImages />
               </div>
            </div>
         </div>
         <div className="w-full flex justify-center">
            <Button
               onClick={() => setShowModal(true)}
               loading={loading}
               disabled={loading}
               variant="filled"
               className="z-10  bg-black text-white dark:bg-white dark:text-black self-center mt-6 "
               size="lg"
               radius={'xl'}
            >
               {userRequest ? 'Update' : 'Submit'}
            </Button>
         </div>
         {showModal && <RequestModal onClose={() => setShowModal(false)} onSure={submitRequest} loading={loading} />}
      </div>
   );
};

export default ProfileRequestPage;
