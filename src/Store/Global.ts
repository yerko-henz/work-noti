import { create } from 'zustand';

import { GlobalStateType } from './types';

export const useGlobalStateStore = create<GlobalStateType>((set) => ({
  config: {
    organization: '',
    ghUser: '',
    ghToken: '',
    refreshPullRequestInterval: 15,
    repos: [],
    watchedRepos: []
  },
  actions: {
    setConfig: (newState) =>
      set((state) => {
        const repos = newState?.repos || state.config.repos;
        const watchedRepos = newState?.watchedRepos || state.config.watchedRepos;
        const filteredRepos = repos.filter((repo) => !watchedRepos.some((wRepo) => wRepo.name.includes(repo.name)));
        const newConfig = { ...state.config, ...newState, repos: filteredRepos };

        localStorage.setItem('appConfig', JSON.stringify(newConfig));

        return { config: newConfig };
      })
  }
}));

export const useGlobalStateActions = () => useGlobalStateStore((state) => state.actions);

export const useConfig = () => useGlobalStateStore((state) => state.config);
