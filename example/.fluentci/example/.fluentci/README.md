# Gradle Pipeline

[![deno module](https://shield.deno.dev/x/gradle_pipeline)](https://deno.land/x/gradle_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gradle-pipeline)](https://codecov.io/gh/fluent-ci-templates/gradle-pipeline)

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
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/gradle_pipeline/mod.ts";

const { check, test, build } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await check(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
