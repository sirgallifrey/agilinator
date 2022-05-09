use crate::config::SrvConfig;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres, migrate};

#[derive(Clone, Debug)]
pub struct DBState {
    pub pool: Pool<Postgres>
}

pub async fn connect_db_pool(config: &SrvConfig) -> DBState {
    let pool = PgPoolOptions::new()
        .max_connections(config.db_max_connections)
        .connect(&config.db_connection_string)
        .await.expect("Could not connect to DB");

    DBState { pool }
}

pub async fn migrate_db(dbState: &DBState) {
    migrate!("./migrations").run(dbState.pool).await.expect("Failed to run migrations");
} 