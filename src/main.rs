use actix_web::{get, App, HttpServer, Responder};
use actix_files::Files;

#[get("/")]
async fn home() -> impl Responder {
    actix_web::HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/index.html"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Portfolio server starting on http://127.0.0.1:8080");
    println!("📱 John Bhujel's portfolio is now live!");
    
    HttpServer::new(|| {
        App::new()
            .service(home)
            .service(Files::new("/static", "./static").show_files_listing())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
} 