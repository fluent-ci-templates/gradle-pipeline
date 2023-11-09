import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("build");

  const push = {
    branches: ["main"],
  };

  const build: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run gradle_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ build });

  return workflow;
}
