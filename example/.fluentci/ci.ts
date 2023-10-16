import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  check,
  test,
  build,
} from "https://pkg.fluentci.io/gradle_pipeline@v0.3.1/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await check(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
