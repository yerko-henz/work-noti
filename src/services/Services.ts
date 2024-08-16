import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthType, ghTokenType } from './types';

const getHeaders = (ghToken: ghTokenType) => {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${ghToken}`
  };
};

const fetchRepos = async ({ ghToken, organization }: AuthType) => {
  const response = await axios.get(`https://api.github.com/orgs/${organization}/repos`, {
    headers: getHeaders(ghToken),
    params: {
      per_page: 100,
      sort: 'updated'
    }
  });

  if (response.status === 200) {
    const storedConfig = JSON.parse(localStorage.getItem('appConfig') || '{}');
    storedConfig.repos = response.data;
    localStorage.setItem('appConfig', JSON.stringify(storedConfig));
  }

  return response.data;
};

export const useFetchRepos = ({ ghToken, organization, enabled }: AuthType & { enabled: boolean }) => {
  return useQuery({
    queryKey: ['repos', { ghToken, organization }],
    queryFn: () => fetchRepos({ ghToken, organization }),
    enabled
  });
};

export const fetchPullRequests = async ({ ghToken, organization, repo }: AuthType & { repo: any[] }) => {
  const response = await axios.get(`https://api.github.com/repos/${organization}/${repo}/pulls`, {
    headers: getHeaders(ghToken),
    params: {
      state: 'open'
    }
  });

  return response.data;
};

export const useFetchPullRequests = ({
  ghToken,
  organization,
  enabled,
  repo
}: AuthType & { enabled: boolean; repo: any[] }) => {
  return useQuery({
    queryKey: ['pull_requests', { ghToken, organization }],
    queryFn: () => fetchPullRequests({ ghToken, organization, repo }),
    enabled
  });
};
