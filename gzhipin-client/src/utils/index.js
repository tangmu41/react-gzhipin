//包含所有的工具函数
export //通过header,type 来判断redirectTo应该跳转哪个界面
function getRedirectTo(type,header){
    let path;
    if(type==='laoban'){
        path='/laoban'
    }else{
        path='/dashen'
    }
    if(!header){
        path+='info'
    }
    return path;
}