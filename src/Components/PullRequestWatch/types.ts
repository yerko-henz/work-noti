export type User = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

export type Reviewer = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

type prBase = {
  label: string;
  repo: {
    name: string;
  };
};

export type PullRequest = {
  author_association: string;
  body: string;
  number: number;
  requested_reviewers: Reviewer[];
  user: User;
  title: string;
  updated_at: string;
  base: prBase;
  id: number;
};

export interface LocalPullRequest extends PullRequest {
  isAuthor: boolean;
  isReviewer: boolean;
  link: string;
  repo: string;
}
