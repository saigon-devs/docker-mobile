import {Image} from 'docker-api-wrapper'

export function imageService(currentDockerEndpoint) {
  return {
    buildDockerApiEndpoint(){
      return new Image(currentDockerEndpoint.ip, currentDockerEndpoint.port)
    },

    getAllImages(options){
      let promise = this.buildDockerApiEndpoint().getAllImages(options)
      return promise
    },

    getImageDetail(options){
      let promise = this.buildDockerApiEndpoint().queryInspectImage(options)
      return promise
    }
  }
}

export function dataService($cordovaSQLite, $q, systemConfig, currentDockerEndpoint) {
  let self = this
  self.db = null

  self.initDB = ()=> {
    if (window.cordova) {
      // App syntax
      self.db = $cordovaSQLite.openDB(systemConfig.dbName);
    } else {
      // Ionic serve syntax
      self.db = window.openDatabase(systemConfig.dbName, "1.0", "docker mobile app", 1);
    }

    $cordovaSQLite.execute(self.db, `
      CREATE TABLE IF NOT EXISTS servers (id integer primary key AUTOINCREMENT, ip text, port text, isSelected numeric);
      `)

    //$cordovaSQLite.execute(self.db, `DELETE FROM servers`)

    //$cordovaSQLite.execute(self.db, `INSERT INTO servers(ip, port, isSelected) VALUES ('jackyu1404.cloudapp.net3', 2375, 0)`)

    self.loadCurrentDockerEndpoint()
      .then((res)=> {
        if (res.rows.length > 0) {
          currentDockerEndpoint.ip = res.rows[0].ip
          currentDockerEndpoint.port = res.rows[0].port
        }
      })
  }

  self.loadCurrentDockerEndpoint = ()=> {
    let query = 'SELECT * FROM servers WHERE isSelected = 1'
    let promise = $cordovaSQLite.execute(self.db, query)
    return promise
  }

  self.loadAllServers = ()=>{
    let query = 'SELECT * FROM servers'
    let promise = $cordovaSQLite.execute(self.db, query)
    return promise
  }

  self.selectDockerEndpoint = (serverId)=>{
    let deferred = $q.defer()
    self.db.transaction((tx)=> {
      tx.executeSql(`UPDATE Servers Set isSelected = 0`)
      tx.executeSql(`UPDATE Servers Set isSelected = 1 WHERE id = ?`, [serverId])
    }, (err)=> {
      deferred.reject(err);
    }, ()=> {
      deferred.resolve();
    })

    return deferred.promise
  }

  self.deleteServer = (serverId)=>{
    let query = 'DELETE FROM Servers WHERE id = ?'
    let promise = $cordovaSQLite.execute(self.db, query, [serverId])
    return promise
  }

  self.updateServer = (editingServer)=>{
    let query = 'UPDATE Servers SET ip =?, port = ? WHERE id = ?'
    let promise = $cordovaSQLite.execute(self.db, query, [editingServer.ip, editingServer.port, editingServer.id])
    return promise
  }

  self.addNewServer = (newServer)=>{
    let query = 'INSERT INTO Servers(ip, port, isSelected) VALUES (?, ?, ?)'
    let promise = $cordovaSQLite.execute(self.db, query, [newServer.ip, newServer.port, newServer.isSelected])
    return promise
  }

  return self
}

