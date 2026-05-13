import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
    layout("./routes/protected.tsx",[
        index("./routes/home.tsx"),
    ]),
    route("/login", "./routes/login.tsx"),
    route("/signup", "./routes/signup.tsx"),
] satisfies RouteConfig
