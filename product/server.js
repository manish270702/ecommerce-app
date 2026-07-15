const app = require("./src/app")

app.listen(process.env.PORT || 3002,()=>{
    console.log("server is running",process.env.PORT)
})
