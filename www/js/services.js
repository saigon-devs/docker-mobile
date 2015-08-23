import {Image} from 'docker-api-wrapper'

export function settingService(){
  return {
    CurrentDockerEndpoint:{
      ip: '',
      port: 2375,
    }
  }
}

export function imageService(settingService){
  return{
    buildDockerApiEndpoint(){
      return new Image(settingService.CurrentDockerEndpoint.ip, settingService.CurrentDockerEndpoint.port)
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

