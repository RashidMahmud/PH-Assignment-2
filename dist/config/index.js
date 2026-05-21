dotenv.config({
    path: path.join(process.cwd(), ".env"),
});
const config = {
    connection_string: process.env.CONNECTIONSTRING,
    port: process.env.PORT,
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    node_env: process.env.NODE_ENV,
    access_expires_in: process.env
        .JWT_ACCESS_EXPIRES_IN,
    refresh_expires_in: process.env
        .JWT_REFRESH_EXPIRES_IN,
};
export default config;
//# sourceMappingURL=index.js.map