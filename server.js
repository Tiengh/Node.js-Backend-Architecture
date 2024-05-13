const app = require("./src/app.js");

const port = process.env.PORT || 3060;

const server = app.listen(port, () => {
  console.log(`server start with port: ${port}`);
});

process.on('SIGINT',()=>{
    server.close(()=>console.log(`Exit server!`));
}) 