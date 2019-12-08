module.exports = {
    apps : [
       {
            name: "Tweet",
            script: "./tweet_management/tweet_service.js",
            instances: 7
        },
        {
            name: "Media",
            script: "./media_management/media_service.js",
            instances: 2,
            increment_var: "PORT",
            env: {
                "PORT": 9000
            }
        }
    ]
}
