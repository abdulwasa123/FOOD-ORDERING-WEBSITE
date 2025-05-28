const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {
        return res.status(401).render("unauthorized.ejs", { title: "Unauthorized" });
    }
    next();
};

module.exports = ensureAuthenticated;
