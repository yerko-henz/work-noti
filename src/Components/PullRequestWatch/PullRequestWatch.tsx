import { SetStateAction, useEffect, useState } from 'react';
import { LocalPullRequest, PullRequest } from '@/Components/PullRequestWatch/types';
import { Anchor, Card, List, ListItem, Text } from '@mantine/core';
import { useConfig } from '@/Store/Global';
import { fetchPullRequests } from '@/services';
import { useQueryClient } from '@tanstack/react-query';

// const watchedRepos = [
//   'agendapro-frontend',
//   'emerald',
//   'business-frontend-monorepo',
//   'business-common-frontend',
//   'emerald-icons',
//   'agendapro-ecommerce-frontend',
//   'business-administration-frontend',
//   'sapphire',
//   'e2e-microfronts'
// ];

const PullRequestWatch = () => {
  const queryClient = useQueryClient();
  const config = useConfig();
  const { ghUser, organization, ghToken, watchedRepos, refreshPullRequestInterval } = config;

  const minutes = refreshPullRequestInterval;
  const intervalDuration = minutes * 60 * 1000;
  const initialCountdown = minutes * 60;

  const [countdown, setCountdown] = useState(initialCountdown);
  const [pulls, setPulls] = useState<LocalPullRequest[]>([]);
  const [viewedPulls, setViewedPulls] = useState<LocalPullRequest[] | []>([]);

  useEffect(() => {
    setCountdown(initialCountdown);

    const allRepoRequests = () =>
      watchedRepos.map(async (repo) =>
        queryClient.fetchQuery({
          queryKey: ['pull_requests', { ghToken, organization, repo: repo.name }],
          queryFn: () => fetchPullRequests({ ghToken, organization, repo: repo.name })
        })
      );

    const getAllRepos = () =>
      Promise.all(allRepoRequests()).then((responseMatrix) => {
        const responseArray: PullRequest[] = responseMatrix.flat();

        const PRdata = responseArray
          .map((pr: PullRequest) => {
            const isAuthor = !!(pr.user.login.toLowerCase() === ghUser);

            const isReviewer = !!pr.requested_reviewers.find((reviewer) => reviewer.login.toLowerCase() === ghUser);

            if (isAuthor || isReviewer) {
              return {
                author_association: pr.author_association,
                body: pr.body,
                number: pr.number,
                id: pr.id,
                requested_reviewers: pr.requested_reviewers,
                user: pr.user,
                title: pr.title,
                updated_at: pr.updated_at,
                repo: pr.base.repo.name,
                link: `https://github.com/${organization}/${pr.base.repo.name}/pull/${pr.number}`,
                isAuthor,
                isReviewer
              };
            }
          })
          .filter((f) => typeof f === 'object');

        setPulls(PRdata as unknown as LocalPullRequest[]);
      });

    getAllRepos();

    const intervalId = setInterval(async () => {
      try {
        await getAllRepos();
        setCountdown(initialCountdown);
      } catch (error) {
        console.error('Error making request:', error);
      }
    }, intervalDuration);

    const countdownIntervalId = setInterval(() => {
      setCountdown((prevCountdown) => Math.max(0, prevCountdown - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownIntervalId);
    };
  }, [watchedRepos]);

  // const addPrLocalStorage = (id: number) => {
  //   const existingIds =
  //     JSON.parse(localStorage.getItem("GH_IDS") || "[]") || [];

  //   const addedIds = JSON.stringify(existingIds.concat(id));

  //   localStorage.setItem("GH_IDS", addedIds);
  //   updateLocalPRs();
  // };
  // const removePrLocalStorage = (id: number) => {
  //   const existingIds =
  //     JSON.parse(localStorage.getItem("GH_IDS") || "[]") || [];

  //   const addedIds = JSON.stringify(
  //     existingIds.filter((f: number) => f !== id)
  //   );

  //   localStorage.setItem("GH_IDS", addedIds);
  //   updateLocalPRs();
  // };

  const updateLocalPRs = (data?: LocalPullRequest[]) => {
    const GH_IDS: string[] = JSON.parse(localStorage.getItem('GH_IDS') || '[]') || [];

    const viewedPR = (data || viewedPulls).filter((f: LocalPullRequest) => GH_IDS.some((s: string) => s === `${f.id}`));
    const notViewedPR = (data || pulls).filter((f: LocalPullRequest) => !GH_IDS.some((s: string) => s === `${f.id}`));

    setPulls(notViewedPR);
    setViewedPulls(viewedPR);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text style={pulls?.length !== 0 ? { marginBottom: '12px' } : {}} size="md">
        {pulls?.length !== 0 ? `Next refresh: ${formatTime(countdown)}` : 'No results...'}
      </Text>

      <List>
        {pulls.map((pull) => (
          <ListItem key={pull.number}>
            {pull?.repo} -{' '}
            <Anchor href={pull.link} target="_blank">
              {pull?.title}
            </Anchor>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default PullRequestWatch;
