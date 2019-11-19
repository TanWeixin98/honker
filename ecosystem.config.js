module.exports = {
    apps : [
        {
            name: "EntryPoint",
            script: "./EntryPoint/src/index.js",
            watch: true,
            instances: 2,
            exec_mode: "cluster",
            increment_var: 'PORT',
            env: {
                "PORT": 8000
            }
        },
        {
            name: "UserAuth",
            script: "./UserAuthAPI/src/index.js",
            watch: true
        },
        {
            name: "User",
            script: "./UserAPI/src/index.js",
            watch: true
        },
        {
            name: "Tweet",
            script: "./tweet_management/tweet_service.js",
            watch: true,
            instances: 2
        },
        {
            name: "Media",
            script: "./media_management/media_service.js",
            watch: true,
            instances: 2,
            increment_var: "PORT",
            env: {
                "PORT": 9000
            }
        }
    ]
}
