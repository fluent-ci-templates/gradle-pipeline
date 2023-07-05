import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { build, test } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("gradle:alpine")
  .addJob("build", build)
  .addJob("test", test);

export default gitlabci;
