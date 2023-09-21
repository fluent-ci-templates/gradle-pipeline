import Client, { withDevbox } from "../../deps.ts";

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

export const build = async (client: Client, src = ".") => {
  const context = client.host().directory(src);

  const baseCtr = withDevbox(
    client
      .pipeline(Job.build)
      .container()
      .from("alpine:latest")
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
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withExec(["sh", "-c", "ls -ltr /nix"])
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", client.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", client.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "ls -ltr /nix"])
    .withExec(["nix", "--version"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew build"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);

  const baseCtr = withDevbox(
    client
      .pipeline(Job.test)
      .container()
      .from("alpine:latest")
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
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withExec(["sh", "-c", "ls -ltr /nix"])
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", client.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", client.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "ls -ltr /nix"])
    .withExec(["nix", "--version"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew test"]);

  const result = await ctr.stdout();

  console.log(result);
};

export const check = async (client: Client, src = ".") => {
  const context = client.host().directory(src);

  const baseCtr = withDevbox(
    client
      .pipeline(Job.build)
      .container()
      .from("alpine:latest")
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
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withExec(["sh", "-c", "ls -ltr /nix"])
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  );

  const ctr = baseCtr
    .withMountedCache("/app/.gradle", client.cacheVolume("gradle-cache"))
    .withMountedCache("/root/.gradle", client.cacheVolume("gradle-root-cache"))
    .withMountedCache("/app/app/build", client.cacheVolume("gradle-app-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["chmod", "+x", "./gradlew"])
    .withExec(["sh", "-c", "ls -ltr /nix"])
    .withExec(["nix", "--version"])
    .withExec(["sh", "-c", "devbox run -- ./gradlew check"]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

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
