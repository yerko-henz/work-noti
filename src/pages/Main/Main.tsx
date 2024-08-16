import { Flex } from '@mantine/core';
import PullRequestWatch from '../../components/PullRequestWatch';
import TrackedRepos from '../../components/WatchedRepos';

const Main = () => {
  return (
    <Flex gap={10} direction="column">
      <TrackedRepos />
      <PullRequestWatch />
    </Flex>
  );
};

export default Main;
