# Gradle Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgradle_pipeline&query=%24.version)](https://pkg.fluentci.io/gradle_pipeline)
[![deno module](https://shield.deno.dev/x/gradle_pipeline)](https://deno.land/x/gradle_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gradle-pipeline)](https://codecov.io/gh/fluent-ci-templates/gradle-pipeline)

A ready-to-use CI/CD Pipeline for your Gradle projects.

## 🚀 Usage

Run the following command:

```bash
fluentci run gradle_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t gradle
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

Or simply:

```bash
fluentci
```

## Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger mod install github.com/fluent-ci-templates/gradle-pipeline@mod
```

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| check  | Check the project   |
| test   | Run the tests       |
| build  | Build the project   |

```typescript
build(
  src: Directory | string | undefined = "."
): Promise<Directory | string>

check(
  src: Directory | string | undefined = "."
): Promise<string>

test(
  src: Directory | string | undefined = "."
): Promise<string>

```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { check, test, build } from "https://pkg.fluentci.io/gradle_pipeline@v0.7.0/mod.ts";

await check();
await test();
await build();
```
