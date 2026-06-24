const app = require("./src/app")

app.listen(process.env.PORT || 5000,()=>{
    console.log("server is running")
})
