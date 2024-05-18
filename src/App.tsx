import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { LocalPullRequest, PullRequest } from "./types";

const user = "YerkoHR";
const watchedRepos = [
  "agendapro-frontend",
  "emerald",
  "business-frontend-monorepo",
  "business-common-frontend",
  "emerald-icons",
  "agendapro-ecommerce-frontend",
  "business-administration-frontend",
];

function App() {
  const minutes = 15;
  const intervalDuration = minutes * 60 * 1000;
  const initialCountdown = minutes * 60;

  const [countdown, setCountdown] = useState(initialCountdown);
  const [pulls, setPulls] = useState<LocalPullRequest[] | []>([]);
  const [viewedPulls, setViewedPulls] = useState<LocalPullRequest[] | []>([]);

  useEffect(() => {
    const Authorization = `Bearer ${localStorage.getItem("ghToken")}`;

    setCountdown(initialCountdown);

    const requests = () =>
      watchedRepos.map(async (repo) => {
        return axios
          .get(`https://api.github.com/repos/agendapro/${repo}/pulls`, {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization,
            },
            params: {
              state: "open",
            },
          })
          .then(({ data }) => data);
      });

    const getAllRepos = () =>
      Promise.all(requests()).then((responseMatrix) => {
        const responseArray: PullRequest[] = responseMatrix.flat();

        const PRdata: LocalPullRequest[] = responseArray
          .map((pr: PullRequest) => {
            const isAuthor = !!(pr.user.login === user);

            const isReviewer = !!pr.requested_reviewers.find(
              (reviewer) => reviewer.login === user
            );

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
                link: `https://github.com/agendapro/${pr.base.repo.name}/pull/${pr.number}`,
                isAuthor,
                isReviewer,
              };
            }
          })
          .filter((f): f is LocalPullRequest => typeof f === "object");

        updateLocalPRs(PRdata);
      });

    getAllRepos();

    const intervalId = setInterval(async () => {
      try {
        await getAllRepos();
        setCountdown(initialCountdown);
      } catch (error) {
        console.error("Error making request:", error);
      }
    }, intervalDuration);

    const countdownIntervalId = setInterval(() => {
      setCountdown((prevCountdown) => Math.max(0, prevCountdown - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownIntervalId);
    };
  }, []);

  console.log("not viewed: ", pulls, "viewed: ", viewedPulls);

  const addPrLocalStorage = (id: number) => {
    const existingIds =
      JSON.parse(localStorage.getItem("GH_IDS") || "[]") || [];

    const addedIds = JSON.stringify(existingIds.concat(id));

    localStorage.setItem("GH_IDS", addedIds);
    updateLocalPRs();
  };
  const removePrLocalStorage = (id: number) => {
    const existingIds =
      JSON.parse(localStorage.getItem("GH_IDS") || "[]") || [];

    const addedIds = JSON.stringify(
      existingIds.filter((f: number) => f !== id)
    );

    localStorage.setItem("GH_IDS", addedIds);
    updateLocalPRs();
  };

  const updateLocalPRs = (data?: LocalPullRequest[]) => {
    const GH_IDS: string[] =
      JSON.parse(localStorage.getItem("GH_IDS") || "[]") || [];

    const viewedPR = (data || viewedPulls).filter((f: LocalPullRequest) =>
      GH_IDS.some((s: string) => s === `${f.id}`)
    );
    const notViewedPR = (data || pulls).filter(
      (f: LocalPullRequest) => !GH_IDS.some((s: string) => s === `${f.id}`)
    );

    setPulls(notViewedPR);
    setViewedPulls(viewedPR);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      <p>Next refresh: {formatTime(countdown)}</p>

      <div className="card">
        <ul>
          {pulls.map((pull) => (
            <li key={pull.number}>
              <p>{pull?.repo} -</p>
              <a href={pull.link} target="_blank">
                {pull?.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
