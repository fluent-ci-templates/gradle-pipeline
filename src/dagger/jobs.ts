import { dag } from "../../sdk/client.gen.ts";
import { Directory } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  build = "build",
  test = "test",
  check = "check",
}

export const exclude = [
  "build",
  ".gradle",
  "app/build",
  ".devbox",
  ".fluentci",
];

/**
 * @function
 * @description Build the project
 * @param {string | Directory} src
 * @returns {string}
 */
export async function build(
  src: Directory | string | undefined = "."
): Promise<Directory | string> {
  const context = await getDirectory(dag, src);

  const baseCtr = dag
    .pipeline(Job.build)
    .container()
    .from("ghcr.io/fluentci-io/devbox:latest")
    .withExec(["apk", "update"])
    .withExec([
      "apk",
      "add",
      "bash",
      "curl",
      "wget",
      "unzip",
      "git",
      "libstdc++",
      "zlib",
      "gcompat",
    ])
    .withExec(["mv", "/nix/store", "/nix/store-orig"])
    .withMountedCache("/nix/store", dag.cacheVolume("nix-cache"))
    .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
    .withExec(["sh", "-c", "curl -fsSL https://get.jetpack.io/devbox | bash"]);

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", dag.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", dag.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", dag.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew build"])
    .withExec(["cp", "-r", "/app/app/build", "/build"]);

  await ctr.stdout();

  const id = await ctr.directory("/build").id();
  return id;
}

/**
 * @function
 * @description Run the tests
 * @param {string | Directory} src
 * @returns {string}
 */
export async function test(src: Directory | string = "."): Promise<string> {
  const context = await getDirectory(dag, src);

  const baseCtr = dag
    .pipeline(Job.test)
    .container()
    .from("ghcr.io/fluentci-io/devbox:latest")
    .withExec(["apk", "update"])
    .withExec([
      "apk",
      "add",
      "bash",
      "curl",
      "wget",
      "unzip",
      "git",
      "libstdc++",
      "zlib",
      "gcompat",
    ])
    .withExec(["mv", "/nix/store", "/nix/store-orig"])
    .withMountedCache("/nix/store", dag.cacheVolume("nix-cache"))
    .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
    .withExec(["sh", "-c", "curl -fsSL https://get.jetpack.io/devbox | bash"]);

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", dag.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", dag.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", dag.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew test"]);

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Check the project
 * @param {string | Directory} src
 * @returns {string}
 */
export async function check(src: Directory | string = "."): Promise<string> {
  const context = await getDirectory(dag, src);

  const baseCtr = dag
    .pipeline(Job.check)
    .container()
    .from("ghcr.io/fluentci-io/devbox:latest")
    .withExec(["apk", "update"])
    .withExec([
      "apk",
      "add",
      "bash",
      "curl",
      "wget",
      "unzip",
      "git",
      "libstdc++",
      "zlib",
      "gcompat",
    ])
    .withExec(["mv", "/nix/store", "/nix/store-orig"])
    .withMountedCache("/nix/store", dag.cacheVolume("nix-cache"))
    .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
    .withExec(["sh", "-c", "curl -fsSL https://get.jetpack.io/devbox | bash"]);

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", dag.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", dag.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", dag.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew check"]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (src?: string) => Promise<Directory | string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.build]: build,
  [Job.test]: test,
  [Job.check]: check,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.build]: "Build the project",
  [Job.test]: "Run the tests",
  [Job.check]: "Check the project",
};
