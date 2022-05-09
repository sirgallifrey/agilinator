mod config;
mod db;

use crate::db::connect_db_pool;
use actix_web::{get, web, App, HttpServer, Responder, middleware};

#[get("/hello/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    format!("Hello {name}!")
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let configuration = config::get_configuration();
    let dbState = connect_db_pool(&configuration).await;
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(dbState.clone()))
            .service(greet)
            .wrap(middleware::Logger::default())
    })
    .bind((configuration.address, configuration.port))?
    .run()
    .await
}
