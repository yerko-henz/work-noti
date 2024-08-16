import PullRequestWatch from '@/components/PullRequestWatch';
import TrackedRepos from '@/components/WatchedRepos';
import { Flex } from '@mantine/core';

const Main = () => {
  return (
    <Flex gap={10} direction="column">
      <TrackedRepos />
      <PullRequestWatch />
    </Flex>
  );
};

export default Main;
