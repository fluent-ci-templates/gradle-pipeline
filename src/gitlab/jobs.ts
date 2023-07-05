import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const build = new Job()
  .stage("build")
  .script("gradle --build-cache assemble")
  .cache(["build", ".gradle"], "$CI_COMMIT_REF_NAME", undefined, "pull");

export const test = new Job()
  .stage("test")
  .script("gradle check")
  .cache(["build", ".gradle"], "$CI_COMMIT_REF_NAME", undefined, "pull");
