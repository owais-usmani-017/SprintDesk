import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})

const myusername = process.env.A_username;

console.log(myusername);
console.log("everything is running smoothly")

