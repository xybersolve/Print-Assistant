module.exports = function(grunt){ "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    devDir:  'client/development',
    prodDir: 'client/production',
    tempDir: '<%= devDir %>/.temp',

    devLibsDir:  '<%= devDir %>/libs',
    prodLibsDir: '<%= prodDir %>/libs',

    devCSS:      '<%= devDir %>/css',
    devAppDir:   '<%= devDir %>/app',
    devJS:       '<%= devAppDir %>/**/**.js',

    prodJSFile:  '<%= prodDir %>/app.js',
    prodCSSFile: '<%= prodDir %>/app.css',

    deployJS: {dir: 'client/production/js', file: 'app.js'},
    deployCSS: {dir: 'client/production/css', file: 'styles.css'},

    jshint: {
      options: {
        jshintrc: ".jshintrc",
        reports: require('jshint-stylish')
      },
      all:[
        'Gruntfile.js',
        '<%= devAppDir %>/app.js',
        '<%= devAppDir %>/**/*.js',
        './server.js',
        './server/**/*.js']
    },

    clean: {
      temp: '<%= tempDir %>',
      production: '<%= prodDir %>'
    },

    concat: {
      options: {
        separator: ';',
        banner: ''
      },
      libs: {
        src:[
          '<%= devLibsDir %>/jquery/jquery.min.js',
          '<%= devLibsDir %>/bootstrap/js/bootstrap.min.js',
          '<%= devLibsDir %>/angular/angular.min.js',
          '<%= devLibsDir %>/angular-animate/angular-animate.min.js',
          '<%= devLibsDir %>/angular-resource/angular-resource.min.js',
          '<%= devLibsDir %>/angular-route/angular-route.min.js',
          '<%= devLibsDir %>/angular-bootstrap/ui-bootstrap.min.js',
          '<%= devLibsDir %>/angular-ui-utils/ui-utils.min.js',
          '<%= devLibsDir %>/angular-ui-router/angular-ui-router.min.js',
          '<%= devLibsDir %>/angular-ui-select/select.min.js',
          '<%= devLibsDir %>/d3/d3.min.js',
          '<%= devLibsDir %>/angular-charts/angular-charts.min.js',
          '<%= devLibsDir %>/toastr/toastr.min.js',
          '<%= devLibsDir %>/angular-file-upload/angular-file-upload.min.js'
        ],
        dest: '<%= tempDir %>/libs.js'
      },
      libsCSS: {
        src:[
          '<%= devLibsDir %>/bootstrap/css/bootstrap.min.css',
          '<%= devLibsDir %>/font-awesome/css/font-awesome.min.css',
          '<%= devLibsDir %>/toastr/toastr.min.css',
          '<%= devLibsDir %>/angular-ui-select/select.min.css'
        ],
        dest: '<%= tempDir %>/concat.css'
      },
      app:{
        src:[
          '<%= devAppDir %>/common/directive/xybersolve/xs-get-script-directory/xs-get-script-directory.js',
          '<%= devAppDir %>/app.js',
          '<%= devAppDir %>/app-modules.js',
          '<%= devAppDir %>/**/**-services.js',
          '<%= devAppDir %>/**/**-routes.js',
          '<%= devAppDir %>/**/**.js'],
        dest: '<%= tempDir %>/concat.js'
      }
    },
    ngmin: {},
    uglify:{
      options: {
        mangle: {
          except:['jQuery','Angular']
        },
        banner: '/*! <%= pkg.name %> - v<%= pkg.verion %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      app: {
        src:['<%= tempDir %>/concat.js'],
        dest:'<%= prodJSFile %>'
      }
    },
    watch: {
      files: ['<%= buildJS %>/controllers/controllers.js',
              '<%= buildJS %>/controllers/controllers.js',
              '<%= buildJS %>/services/services.js'],
      tasks:['concat:js']
    },
    less: {
      src:'<%= devCSS %>/styles.less',
      dest:'<%= devCSS %>/styles.css'
    },
    tasks: {
      cat: 'This is the concatenator!',
      ugly: 'This is the uglifier!'
    }
 });
  grunt.registerTask('build', ['codeCheck', 'clean', 'libs']);
  grunt.registerTask('codeCheck', ['jshint']);
  grunt.registerTask('libs', ['concat:libs', 'concat:libsCSS']);


  grunt.registerTask('default', function(){
    grunt.log.ok('Loading and watching files.');
  });
  //grunt.registerTask('build', ['clean:build', 'less', 'concat', 'uglify']);
  grunt.registerMultiTask('tasks', function(){
      grunt.log.write(this.taget + ': ' + this.data);
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-string-replace');
  //grunt.loadNpmTasks('ngmin');

};

/*
 grunt.registerTask('default', function(){
 grunt.log.writeln('Hello ' + grunt.config.get('person').name);
 grunt.log.writeln(grunt.config.get('compile'));
 grunt.log.writeln(grunt.template.process('<%= files %>'));
 grunt.log.writeln(grunt.template.today());
 });

 'string-replace': {
 dev: {
 files:['server.js'],

 options: {
 replacements: [
 {
 pattern: '$PULBIC_DIR',
 replacement: 'src/'
 }
 ]
 }
 },*/
