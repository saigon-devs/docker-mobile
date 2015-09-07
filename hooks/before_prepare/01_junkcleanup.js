#!/usr/bin/env node
var fs = require('fs')
var path = require('path')

var folderToProcess = ['lib']

folderToProcess.forEach(function(folder){
  processFiles('www/' + folder)
})

function processFiles(dir){
  fs.readdir(dir, function(err, list){
    if(err){
      console.log('process file err: ' + err)
      return
    }
    list.forEach(function(file){
      file = dir + '/' + file
      fs.stat(file, function(err, stat){
        if(!stat.isDirectory()){
          var listFileNeedToDelete = [
            '.json'
            ,'.jspm-hash'
            ,'.jspm.json'
            ,'.md'
            ,'.gzip'
            ,'.map'
            ,'.html'
            ,'.loaderversions'
            ,'ionic.bundle.js', 'ionic.bundle.min.js', 'ionic.js', 'ionic-angular.js'
            ,'.gitignore', '.bowerrc', '.editorconfig','.gitmodules', '.jshintrc', '.travis.yml'
            ,'ng-cordova.js', 'ng-cordova-mocks.js'
            ,'test.js'
          ]
          if(listFileNeedToDelete.indexOf(path.extname(file)) > 0 ||
              listFileNeedToDelete.indexOf(path.basename(file)) > 0){
            fs.unlink(file, function(err){
              console.log("Removed file " + file)
            })
          }
          else{
            console.log("Skipping file " + file);
          }
        }
        else{
          switch(path.basename(file)){
            case 'demo':
            case 'scss':
            case 'sass':
            case 'src':
            case 'config':
            case 'test':
            case 'less':
            case 'bower_components':
            case 'docs':
            case 'node_modules':
            case 'examples':
              deleteFolderRecursive(file)
              break
            default:
              processFiles(file)
          }
        }
      })
    })
  })
}

function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};