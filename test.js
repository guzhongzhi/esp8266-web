window.listBrowserFiles = function(){return [{title:"xxxxxxxx",lastModified:1700664154,size:1024,type:"F"}]}


window.oldListBrowserFiles = window.listBrowserFiles
window.listBrowserFiles = function (callback){
  console.log("EEEE")
  window.oldListBrowserFiles((files)=>{
    console.log(files)
    files.push({title:"xxxxxxxx",lastModified:1700664154,size:1024,type:"F"})
    callback(files);
  })
}
