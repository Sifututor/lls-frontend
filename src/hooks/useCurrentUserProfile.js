// src/hooks/useCurrentUserProfile.js
import { useMemo } from 'react';
import { useGetAccountSettingsQuery } from '../store/api/authApi';

const DEFAULT_AVATAR = '/assets/images/icons/Ellipse 3.svg';

/**
 * Global user profile from RTK Query (getAccountSettings).
 * Use this anywhere you need current user name, avatar, email, phone.
 * Updates propagate instantly when profile is updated (cache invalidation + optional patch).
 */
export function useCurrentUserProfile(options = {}) {
  const { data, isLoading, isError, error, refetch, isFetching } = useGetAccountSettingsQuery(undefined, {
    skip: options.skip ?? false,
    refetchOnMountOrArgChange: options.refetchOnMountOrArgChange ?? true,
    ...options,
  });

  const profile = useMemo(() => {
    if (!data?.data) return null;
    const normalized = data.data.normalized;
    const user = data.data.user ?? {};
    const profileData = data.data.profile ?? {};
    if (normalized) {
      return {
        name: normalized.name || user?.name || 'User',
        email: normalized.email || user?.email || '',
        phone: normalized.phone || '',
        avatar: normalized.avatar || DEFAULT_AVATAR,
        first_name: normalized.first_name ?? '',
        last_name: normalized.last_name ?? '',
        country: normalized.country ?? '',
        dob: normalized.dob ?? '',
        raw: data.data,
      };
    }
    const name = [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' ') || user?.name || '';
    return {
      name,
      email: profileData?.email ?? user?.email ?? '',
      phone: profileData?.phone ?? '',
      avatar: profileData?.profile_image || DEFAULT_AVATAR,
      first_name: profileData?.first_name ?? '',
      last_name: profileData?.last_name ?? '',
      country: profileData?.country ?? '',
      dob: profileData?.dob ?? '',
      raw: data.data,
    };
  }, [data]);

  const profileForCard = useMemo(() => {
    if (!profile) return null;
    return {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      bio: profile.raw?.profile?.bio ?? '',
      location: profile.raw?.profile?.country ?? profile.country ?? '',
      contactEmail: profile.email,
      timezone: profile.raw?.profile?.timezone ?? '',
      isPremium: profile.raw?.user?.is_premium === true || profile.raw?.user?.is_premium === '1',
    };
  }, [profile]);

  return {
    profile,
    profileForCard,
    rawData: data?.data ?? null,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isReady: !isLoading && !!data,
  };
}

export default useCurrentUserProfile;
