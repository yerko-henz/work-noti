import { useEffect, useState } from 'react';
import { useFetchRepos } from '@/services/Services';
import { useConfig, useGlobalStateActions } from '@/Store/Global';
import { Anchor, Badge, Button, Center, Tooltip, Combobox, Flex, InputBase, rem, useCombobox } from '@mantine/core';
import { IconGitBranch, IconReload, IconWorldShare } from '@tabler/icons-react';

const WatchedRepos = () => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });

  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const config = useConfig();
  const { setConfig } = useGlobalStateActions();
  const { ghUser, organization, ghToken, repos, watchedRepos } = config;

  const { data: refetchedRepos, refetch, isSuccess } = useFetchRepos({ ghToken, organization, enabled: false });

  const filterRepos = (repos: Array<{ name: string }>, search: string) => {
    const searchLower = search.toLowerCase().trim();
    return repos.filter((repo) => {
      const repoNameParts = repo.name.toLowerCase().split(/[-_]/); // Split by hyphen and underscore
      return repoNameParts.some((part) => part.includes(searchLower));
    });
  };

  const filteredOptions = search ? filterRepos(repos, search) : repos;

  const options = filteredOptions.map((repo) => (
    <Combobox.Option value={repo.name} key={repo.id}>
      {repo.name}
    </Combobox.Option>
  ));

  const reloadRepos = () => {
    refetch();
  };

  useEffect(() => {
    if (value) {
      const repoToWatch = repos.filter((repo) => repo.name === value);
      const newReposToWatch = watchedRepos.concat(repoToWatch);

      setConfig({ watchedRepos: newReposToWatch });
    }
  }, [value]);

  useEffect(() => {
    if (isSuccess) setConfig({ repos: refetchedRepos });
  }, [isSuccess]);

  // https://github.com/agendapro/agendapro-ecommerce-frontend/actions

  return (
    <Center>
      <Flex direction="column" gap={10}>
        <Flex gap={10} justify="center">
          <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
              setValue(val);
              setSearch(val);
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <InputBase
                rightSection={<Combobox.Chevron />}
                value={search}
                onChange={(event) => {
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onClick={() => {
                  setSearch('');
                  combobox.openDropdown();
                }}
                onFocus={() => {
                  combobox.openDropdown();
                }}
                onBlur={() => {
                  setSearch('');
                  combobox.closeDropdown();
                }}
                placeholder="Search repo"
                rightSectionPointerEvents="none"
              />
            </Combobox.Target>

            <Combobox.Dropdown>
              <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          <Button px={10} size="sm" variant="light" color="gray" onClick={reloadRepos}>
            <Tooltip label="refresh repos">
              <IconReload size={18} />
            </Tooltip>
          </Button>
        </Flex>
        <Flex gap={3} wrap="wrap" align="center" justify="center">
          {watchedRepos.length > 0 &&
            watchedRepos.map((repo) => (
              <Badge
                leftSection={
                  <Tooltip label="Go to repo">
                    <Anchor
                      style={{ display: 'flex' }}
                      href={repo.html_url}
                      target="_blank"
                      underline="never"
                      key={`${repo.name}-${repo.id}`}
                    >
                      <IconGitBranch style={{ width: rem(16), height: rem(16) }} />
                    </Anchor>
                  </Tooltip>
                }
                rightSection={
                  <Tooltip label="Go to deploy">
                    <Anchor
                      style={{ display: 'flex' }}
                      href={repo.html_url}
                      target="_blank"
                      underline="never"
                      key={`${repo.name}-${repo.id}`}
                    >
                      <IconWorldShare style={{ width: rem(16), height: rem(16) }} />
                    </Anchor>
                  </Tooltip>
                }
                color="grey"
                variant="light"
                size="lg"
              >
                {repo.name}
              </Badge>
            ))}
        </Flex>
      </Flex>
    </Center>
  );
};

export default WatchedRepos;
