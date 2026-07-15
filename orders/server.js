const app = require("./src/app")


app.listen(process.env.PORT||3003,()=>{
    console.log("server is running")
})