use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn task(args: String) -> FnResult<String> {
    let mut jdk_version = dag().get_env("JDK_VERSION").unwrap_or("17.0.7+7".into());
    if jdk_version.is_empty() {
        jdk_version = "17.0.7+7".into();
    }

    let stdout = dag()
        .devbox()?
        .with_exec(vec![
            "devbox",
            "global",
            "add",
            &format!("jdk@{}", jdk_version),
        ])?
        .with_exec(vec![
            r#"
            eval "$(devbox global shellenv --recompute)"
            ./gradlew"#,
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn check(args: String) -> FnResult<String> {
    let mut jdk_version = dag().get_env("JDK_VERSION").unwrap_or("17.0.7+7".into());
    if jdk_version.is_empty() {
        jdk_version = "17.0.7+7".into();
    }

    let stdout = dag()
        .pipeline("check")?
        .devbox()?
        .with_exec(vec![
            "devbox",
            "global",
            "add",
            &format!("jdk@{}", jdk_version),
        ])?
        .with_exec(vec![
            r#"
            eval "$(devbox global shellenv --recompute)"
            ./gradlew check"#,
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let mut jdk_version = dag().get_env("JDK_VERSION").unwrap_or("17.0.7+7".into());
    if jdk_version.is_empty() {
        jdk_version = "17.0.7+7".into();
    }

    let stdout = dag()
        .pipeline("check")?
        .devbox()?
        .with_exec(vec![
            "devbox",
            "global",
            "add",
            &format!("jdk@{}", jdk_version),
        ])?
        .with_exec(vec![
            r#"
            eval "$(devbox global shellenv --recompute)"
            ./gradlew build"#,
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let mut jdk_version = dag().get_env("JDK_VERSION").unwrap_or("17.0.7+7".into());
    if jdk_version.is_empty() {
        jdk_version = "17.0.7+7".into();
    }

    let stdout = dag()
        .pipeline("check")?
        .devbox()?
        .with_exec(vec![
            "devbox",
            "global",
            "add",
            &format!("jdk@{}", jdk_version),
        ])?
        .with_exec(vec![
            r#"
            eval "$(devbox global shellenv --recompute)"
            ./gradlew test"#,
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}
