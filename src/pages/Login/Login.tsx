import { useEffect, useState } from 'react';
import { useFetchRepos } from '@/services/Services';
import { useConfig, useGlobalStateActions } from '@/Store/Global';
import { Button, Center, Flex, TextInput } from '@mantine/core';

const Login = () => {
  const config = useConfig();
  const { setConfig } = useGlobalStateActions();
  const { ghUser, organization, ghToken } = config;

  const [localConfig, setLocalConfig] = useState({
    ghToken: ghToken || '',
    ghUser: ghUser || '',
    organization: organization || ''
  });
  const [fetchOnDemand, setFetchOnDemand] = useState(false);

  const {
    data: repos,
    isLoading,
    isSuccess
  } = useFetchRepos({
    ghToken: localConfig.ghToken,
    organization: localConfig.organization,
    enabled: !!localConfig.ghToken && !!localConfig.organization && fetchOnDemand
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleLogin = () => {
    setFetchOnDemand(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setConfig({ ...localConfig, repos });
    }
  }, [repos, isSuccess]);

  return (
    <Center>
      <Flex gap="md" justify="center" align="center" direction="column">
        <TextInput
          label="Organization"
          withAsterisk
          placeholder="Input organization"
          name="organization"
          disabled={isLoading}
          value={localConfig.organization}
          onChange={handleInputChange}
        />
        <TextInput
          label="Github User"
          withAsterisk
          placeholder="Input Github User"
          name="ghUser"
          disabled={isLoading}
          value={localConfig.ghUser}
          onChange={handleInputChange}
        />
        <TextInput
          label="Github Token"
          withAsterisk
          placeholder="Input Github Token"
          type="password"
          name="ghToken"
          disabled={isLoading}
          value={localConfig.ghToken}
          onChange={handleInputChange}
        />
        <Button
          disabled={!localConfig.ghUser || !localConfig.organization || !localConfig.ghToken}
          loading={isLoading}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Flex>
    </Center>
  );
};

export default Login;
