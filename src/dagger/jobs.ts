import { Client } from "../../sdk/client.gen.ts";
import { connect } from "../../sdk/connect.ts";
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
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);

    const baseCtr = client
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
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
      .withExec(["sh", "-c", "devbox version update"]);

    const ctr = baseCtr
      .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
      .withMountedCache(
        "/root/.gradle",
        client.cacheVolume("gradle-root-cache")
      )
      .withMountedCache(
        "/app/app/build",
        client.cacheVolume("gradle-app-build")
      )
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["chmod", "+x", "./gradlew"])
      .withExec(["sh", "-c", "devbox run -- ./gradlew build"])
      .withExec(["cp", "-r", "/app/app/build", "/build"]);

    await ctr.stdout();

    id = await ctr.id();
  });
  return id;
}

/**
 * @function
 * @description Run the tests
 * @param {string | Directory} src
 * @returns {string}
 */
export async function test(src = "."): Promise<string> {
  let result = "";
  await connect(async (client: Client) => {
    const context = client.host().directory(src);

    const baseCtr = client
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
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
      .withExec(["sh", "-c", "devbox version update"]);

    const ctr = baseCtr
      .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
      .withMountedCache(
        "/root/.gradle",
        client.cacheVolume("gradle-root-cache")
      )
      .withMountedCache(
        "/app/app/build",
        client.cacheVolume("gradle-app-build")
      )
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["chmod", "+x", "./gradlew"])
      .withExec(["sh", "-c", "devbox run -- ./gradlew test"]);

    result = await ctr.stdout();
  });
  return result;
}

/**
 * @function
 * @description Check the project
 * @param {string | Directory} src
 * @returns {string}
 */
export async function check(src = "."): Promise<string> {
  let result = "";
  await connect(async (client: Client) => {
    const context = client.host().directory(src);

    const baseCtr = client
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
      .withMountedCache("/nix/store", client.cacheVolume("nix-cache"))
      .withExec(["sh", "-c", "cp -r /nix/store-orig/* /nix/store/"])
      .withExec(["sh", "-c", "devbox version update"]);

    const ctr = baseCtr
      .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
      .withMountedCache(
        "/root/.gradle",
        client.cacheVolume("gradle-root-cache")
      )
      .withMountedCache(
        "/app/app/build",
        client.cacheVolume("gradle-app-build")
      )
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["chmod", "+x", "./gradlew"])
      .withExec(["sh", "-c", "devbox run -- ./gradlew check"]);

    result = await ctr.stdout();
  });
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
