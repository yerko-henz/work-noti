import { Flex } from '@mantine/core';
import PullRequestWatch from '@/Components/PullRequestWatch';
import TrackedRepos from '@/Components/WatchedRepos';

const Main = () => {
  return (
    <Flex gap={10} direction="column">
      <TrackedRepos />
      <PullRequestWatch />
    </Flex>
  );
};

export default Main;
