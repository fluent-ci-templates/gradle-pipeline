# Gradle Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgradle_pipeline&query=%24.version)](https://pkg.fluentci.io/gradle_pipeline)
[![deno module](https://shield.deno.dev/x/gradle_pipeline)](https://deno.land/x/gradle_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gradle-pipeline)](https://codecov.io/gh/fluent-ci-templates/gradle-pipeline)

A ready-to-use CI/CD Pipeline for your Gradle projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci gradle_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t gradle
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

Or simply:

```bash
fluentci
```

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| check  | Check the project   |
| test   | Run the tests       |
| build  | Build the project   |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import Client, { connect } from "https://sdk.fluentci.io/v0.1.7/mod.ts";
import { check, test, build } from "https://pkg.fluentci.io/gradle_pipeline@v0.3.0/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await check(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
