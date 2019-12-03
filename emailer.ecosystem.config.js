
module.exports = {
    apps : [
        {
            name: "Emailer",
            script: "./Email/index.js",
            instances: 4,
            watch: true
        }
    ]
}
