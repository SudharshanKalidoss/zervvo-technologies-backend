const authRoutes = require("../routes/auth");
const authorRoutes = require("../routes/authors");
const bookRoutes = require("../routes/books");

exports.initialRoutes  = (app)=>{
    app.get("/health", (req, res) => {
        return res.status(200).send({ message: "Server is healthy" });
    });
    app.use("/api/auth", authRoutes);
    app.use("/api/authors", authorRoutes);
    app.use("/api/books", bookRoutes);
}

