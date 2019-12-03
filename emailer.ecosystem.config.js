
module.exports = {
    apps : [
        {
            name: "Emailer",
            script: "./Email/index.js",
            instances: 2,
            watch: true
        }
    ]
}
