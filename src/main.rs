use actix_web::{get, App, HttpServer, Responder};
use actix_files::Files;

#[get("/")]
async fn home() -> impl Responder {
    actix_web::HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/index.html"))
}

#[get("/contact")]
async fn contact() -> impl Responder {
    actix_web::HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/contact.html"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Portfolio server starting on http://127.0.0.1:8080");
    println!("📱 John Bhujel's portfolio is now live!");
    println!("📧 Contact form available at http://127.0.0.1:8080/contact");
    
    HttpServer::new(|| {
        App::new()
            .service(home)
            .service(contact)
            .service(Files::new("/", "./static").show_files_listing())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
} 