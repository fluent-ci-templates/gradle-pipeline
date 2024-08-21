use extism_pdk::*;
use fluentci_pdk::dag;

pub mod helpers;

#[plugin_fn]
pub fn task(args: String) -> FnResult<String> {
    helpers::setup_jdk()?;

    let stdout = dag()
        .mise()?
        .with_exec(vec!["./gradlew", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn check(args: String) -> FnResult<String> {
    helpers::setup_jdk()?;
    let stdout = dag()
        .pipeline("check")?
        .mise()?
        .with_exec(vec!["./gradlew", "check", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    helpers::setup_jdk()?;

    let stdout = dag()
        .pipeline("build")?
        .mise()?
        .with_exec(vec!["./gradlew", "build", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    helpers::setup_jdk()?;

    let stdout = dag()
        .pipeline("test")?
        .mise()?
        .with_exec(vec!["./gradlew", "test", &args])?
        .stdout()?;
    Ok(stdout)
}
