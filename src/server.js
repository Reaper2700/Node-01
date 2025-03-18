import http from "node:http"
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js"

    const server = http.createServer(async(req, res) =>{
        const { method, url} = req;

        await json(req, res)


        console.log(method, url);

        const route = routes.find(route =>{
            return route.method == method && route.path.test(url);
        })
        if(route){
            const routeParams = req.url.match(route.path)

            const { query, ...params} = routeParams.groups

            req.params = params
            req.query = query

            return route.handler(req,res)
        }
        console.log(route)

        return res.writeHead(200).end('foi server')
    })

    server.listen(3350)