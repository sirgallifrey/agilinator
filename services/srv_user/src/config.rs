use config::Config;
use serde::Deserialize;

/// Configuration for User service
#[derive(Debug, Default, Deserialize, PartialEq)]
pub struct SrvConfig {
    /// Address to run the web server
    pub address: String,
    /// port to run the web server
    pub port: u16,
    /// Connection string to Postgres DB
    pub db_connection_string: String,
    pub db_max_connections: u32
}

/// Get's configuration from Enviroment variables
/// will panic if fails as application should not run missconfigured
pub fn get_configuration() -> SrvConfig {
    let config_source = Config::builder()
        .add_source(
            config::Environment::with_prefix("SRV_USER")
                .try_parsing(true)
                // .separator("_"),
        )
        .build()
        .unwrap();

    let config: SrvConfig = config_source.try_deserialize().expect("Could not deserialize configuration");
    config
}
