use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_jdk() -> Result<(), Error> {
    let mut jdk_version = dag()
        .get_env("JDK_VERSION")
        .unwrap_or("zulu-17.46.19".into());
    if jdk_version.is_empty() {
        jdk_version = "zulu-17.46.19".into();
    }

    dag().call(
        "https://pkg.fluentci.io/java@v0.1.2?wasm=1",
        "setup",
        vec![&jdk_version],
    )?;

    let home = dag().get_env("HOME")?;
    dag().set_envs(vec![(
        "JAVA_HOME".into(),
        format!("{}/.local/share/mise/installs/java/{}", home, jdk_version),
    )])?;

    Ok(())
}
