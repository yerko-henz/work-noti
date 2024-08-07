import { AppShell, AppShellMain, rem } from "@mantine/core";
import Login from "./Components/Login";

function App() {
  return (
    <AppShell padding="md">
      <AppShellMain pt={`calc(${rem(100)} + var(--mantine-spacing-md))`}>
        {/* <PullRequestWatch /> */}
        <Login />
      </AppShellMain>
    </AppShell>
  );
}

export default App;
