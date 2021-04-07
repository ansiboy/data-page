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
            }
        },
    };

    grunt.initConfig(config);

    grunt.registerTask('default', ['shell']);


}