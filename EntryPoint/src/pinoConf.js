module.exports = {
    defaultOptions : () =>  { return {
        //  Usage: Runs before request has entered it's route
        /*
        startLog:{
            //  Accepts array of strings
            req: ['req.body','req.method','req.query','req.url'],
            //  Accepts string
            user: 'req.user',
            /*  Accepts object with string
        user: {
          user_id: 'req.user.sub'
        }
        */
            /*  Accepts object array of strings
        user: {
          foo: ['req.user.bar','req.user.bar1', 'req.user.bar2']
        }
        */

        // },
        //  Usage: req.log.info('log msg') or req.log.[level]('log msg')..
        base: null,
        timestamp: false,
        //  Usage: Runs on response errored
        errorLog: {
            err: 'err',
            req: ['req.body','req.headers','req.params','req.query'],
            res: ['res._headers','res.shouldKeepAlive','res.statusCode','res.statusMessage'],
            user: 'req.user',
        },
        //  Usage: Runs after request.end() has been called
            req: ['req.body']
    }
    }
}
