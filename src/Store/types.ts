export type configType = {
  organization: string;
  ghUser: string;
  ghToken: string;
  refreshPullRequestInterval: number;
  repos: Array<any>;
  watchedRepos: Array<any>;
};

export type GlobalStateType = {
  config: configType;
  actions: {
    setConfig: (newState: Partial<configType>) => void;
  };
};
