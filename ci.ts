import {
  check,
  test,
  build,
} from "https://pkg.fluentci.io/gradle_pipeline@v0.5.0/mod.ts";

await check();
await test();
await build();
