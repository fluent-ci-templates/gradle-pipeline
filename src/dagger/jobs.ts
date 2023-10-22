import Client, { connect } from "../../deps.ts";

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

export const build = async (src = ".") => {
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
      .withExec(["sh", "-c", "devbox run -- ./gradlew build"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const test = async (src = ".") => {
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

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const check = async (src = ".") => {
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

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

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
