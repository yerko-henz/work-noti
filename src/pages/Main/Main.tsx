import { useEffect, useState } from 'react';
import { useConfig, useGlobalStateActions } from '@/Store/Global';
import PullRequestWatch from '@/components/PullRequestWatch';
import TrackedRepos from '@/components/WatchedRepos';
import { Flex } from '@mantine/core';

const Main = () => {
  const config = useConfig();
  const { setConfig } = useGlobalStateActions();
  const { ghUser, organization, ghToken } = config;

  return (
    <Flex gap={10} direction="column">
      <TrackedRepos />
      <PullRequestWatch />
    </Flex>
  );
};

export default Main;
