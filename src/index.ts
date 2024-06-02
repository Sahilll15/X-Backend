import { initServer } from "./app";



async function init(){
        const app=await initServer()

        app.listen({port:4000},()=>console.log('Server is running on http://localhost:4000/graphql'));
}

init();