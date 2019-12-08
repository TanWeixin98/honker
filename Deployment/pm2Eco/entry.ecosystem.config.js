module.exports = {
    apps : [
        {
            name: "EntryPoint",
            script: "./EntryPoint/src/index.js",
            watch: true,
            instances: 6,
            exec_mode: "cluster",
            increment_var: 'PORT',
            env: {
                "PORT": 8000
            }
        }
    ]
}
