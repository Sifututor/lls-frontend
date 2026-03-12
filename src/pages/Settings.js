import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Privacysettingscard from '../components/Privacysettingscard';
import Dataexportcard from '../components/Dataexportcard';
import Parentaccesscard from '../components/Parentaccesscard';
import Deleteaccountcard from '../components/Deleteaccountcard';
import {
  useGetParentAccessQuery,
  useGenerateParentAccessMutation,
  useRegenerateParentAccessMutation,
} from '../store/api/authApi';
import { selectCurrentUser } from '../store/slices/authSlice';

const COMING_SOON = 'This feature is coming soon.';

function extractLinkFromResponse(data) {
  if (!data) return null;
  const link = data?.data?.link ?? data?.link ?? data?.data?.url ?? data?.url;
  if (link && typeof link === 'string') return link;
  const token =
    data?.data?.token ??
    data?.token ??
    data?.data?.data?.token ??
    data?.data?.accessToken ??
    data?.accessToken ??
    data?.data?.access_token ??
    data?.access_token ??
    data?.data?.data?.accessToken ??
    data?.data?.data?.access_token;
  if (!token || typeof window === 'undefined') return null;
  return `${window.location.origin}/parent-access/${token}`;
}

function buildParentLink(token) {
  if (!token || typeof window === 'undefined') return null;
  return `${window.location.origin}/parent-access/${token}`;
}

function Settings() {
  const currentUser = useSelector(selectCurrentUser);
  const isStudent = currentUser?.user_type === 'student';
  const { data: parentAccessData, refetch: refetchParentAccess } = useGetParentAccessQuery(undefined, { skip: !isStudent });
  const [generateLink, { isLoading: generating }] = useGenerateParentAccessMutation();
  const [regenerateLink, { isLoading: regenerating }] = useRegenerateParentAccessMutation();
  const [freshLink, setFreshLink] = useState(null);

  const tokenFromApi =
    parentAccessData?.data?.token ??
    parentAccessData?.token ??
    parentAccessData?.data?.data?.token ??
    parentAccessData?.data?.accessToken ??
    parentAccessData?.accessToken ??
    parentAccessData?.data?.access_token ??
    parentAccessData?.access_token ??
    parentAccessData?.data?.data?.accessToken ??
    parentAccessData?.data?.data?.access_token;
  const linkFromApi =
    parentAccessData?.data?.link ??
    parentAccessData?.link ??
    (tokenFromApi ? buildParentLink(tokenFromApi) : null);

  const storedLink =
    typeof window !== 'undefined' ? window.localStorage.getItem('parentAccessLink') : null;

  const parentAccessLink = linkFromApi || freshLink || storedLink;

  const handleRegenerate = useCallback(async () => {
    try {
      const result = parentAccessLink
        ? await regenerateLink().unwrap()
        : await generateLink().unwrap();
      const link = extractLinkFromResponse(result);
      if (link) {
        setFreshLink(link);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('parentAccessLink', link);
        }
      }
      refetchParentAccess();
      toast.success(parentAccessLink ? 'Link regenerated' : 'Link generated');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to generate link');
    }
  }, [parentAccessLink, generateLink, regenerateLink, refetchParentAccess]);

  const handleCopy = () => {
    if (parentAccessLink) {
      navigator.clipboard.writeText(parentAccessLink).then(() => toast.success('Link copied')).catch(() => toast.error('Could not copy'));
    } else {
      toast.info('Generate a link first');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-page-header" style={{ marginBottom: '24px' }}>
        <h1 className="settings-page-title">Settings</h1>
        <p className="settings-page-subtitle" style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
          Some options are coming soon.
        </p>
      </div>
      <Privacysettingscard />
      <Dataexportcard />
      <Parentaccesscard
        link={parentAccessLink}
        onRegenerate={handleRegenerate}
        onCopy={handleCopy}
        isGenerating={generating || regenerating}
      />
      <Deleteaccountcard onDownload={() => toast.info(COMING_SOON)} />
    </div>
  );
}

export default Settings;