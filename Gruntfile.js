module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    var config = {
        shell: {
            src: {
                command: 'tsc -p src',
                options: {
                    failOnError: false
                }
            },
            webpack: {
                command: 'webpack',
                options: {
                    failOnError: false
                }
            },
            demo: {
                command: "node-static demo",
                options: {
                    execOptions: {
                        cwd: __dirname
                    }
                }
            },
            chrome: {
                command: "start chrome http://127.0.0.1:45326",
            }
        },

    };

    grunt.initConfig(config);

    grunt.registerTask('build', ['shell:src', "shell:webpack"]);
    grunt.registerTask('demo', ["shell:chrome", "shell:demo"])

}