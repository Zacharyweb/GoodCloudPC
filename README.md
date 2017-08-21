# 好云商建材城后台管理系统

## 项目描述
好云商建材城后台管理系统是好云商项目的子项目，系统主要用于各建材城及其下属门店对好云商手机端App展示的数据进行管理。

## 项目架构
好云商建材城后台管理系统采用`Jquery及其插件`+`artTemplate`系统架构进行开发，配合构建工具`gulp`进行项目的打包。

## 项目目录结构
项目位于`/project`文件夹下。
```
├─assets         //存放模板静态资源
├─css            //存放CSS文件
├─img            //存放图片资源
├─js             //存放js文件
├─plugin         //存放第三方插件
├─shared         //存放公共页面模块，项目打包时由gulp-file-include统一在各个页面引入
└─views          //存放各个页面
    ├─operate        //存放运营后台页面
    ├─thirdparty     //存放第三方后台页面
    └─user           //存放用户后台页面
```

## 项目运行

``` bash
# install dependencies
npm install

# build for production with minification
gulp publish

```