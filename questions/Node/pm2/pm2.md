# pm2
<!-- https://blog.csdn.net/chengxuyuanyonghu/article/details/74910875 -->

## 常用命令列表

* pm2 start app.js                  启动app.js应用程序
* pm2 start app.js -i 4             cluster mode模式启动4个app.js的应用实例[4个应用程序会自动进行负载均衡]
* pm2 start app.js --name="api"     启动应用程序并命名为“api”
* pm2 start app.js --watch          当文件变化时自动重启应用
* pm2 start script.sh               启动bash脚本

* pm2 list                          列表显示pm2启动的所有的应用程序
* pm2 monit                         显示每个应用程序的CPU和内存占用情况
* pm2 show [app-name]               显示应用程序的所有信息

* pm2 logs                          显示所有应用程序的日志
* pm2 logs [app-name]               显示指定应用程序的日志
* pm2 flush                         日志清理

* pm2 stop all                      停止所有的应用程序
* pm2 stop 0                        停止id为0的指定应用程序
* pm2 restart all                   重启所有应用
* pm2 reload all                    重启cluster mode下的所有应用
* pm2 gracefulReload all            Graceful reload all apps in cluster mode
* pm2 delete all                    关闭并删除所有应用
* pm2 delete 0                      把名字叫api的应用扩展到10个实例
* pm2 scale api 10                  把名字叫api的应用扩展到10个实例
* pm2 reset [app-name]              重置重启数量

* pm2 startup                       创建开机自启动命令
* pm2 save                          保存当前应用列表
* pm2 resurrect                     重新加载保存的应用列表

* pm2 update                        Save processes, kill pm2 and restore processes
* pm2 generate                      Generate a sample json configuartion file
* pm2 deploy app.json prod setup    Setup "prod" remote server
* pm2 deploy app.json prod          Update "prod" remote server
* pm2 deploy app.json prod revert 2 Revert "prod" remote server by 2

* pm2 module:generate [name]        Generate sample module with name [name]
* pm2 install pm2-logrotate         Install module(here a log rotation system)
* pm2 uninstall pm2-logrotate       Uninstall module
* pm2 publish                       Increment version, git push and npm publish

## 安装

npm install -g pm2

## 自动创建目录介绍

* $HOME/.pm2            will contain all PM2 related files
* $HOME/.pm2/logs       will contain all applications logs
* $HOME/.pm2/pids       will contain all applications pids
* $HOME/.pm2/pm2.log    PM2 logs
* $HOME/.pm2/pm2.pid    PM2 pid
* $HOME/.pm2/rpc.sock   Socket file for remote commands
* $HOME/.pm2/pub.sock   Socket file for publishable events
* $HOME/.pm2/conf.js    PM2 Comfiguration

## 常用命令

### 启动参数

* --watch               监听应用目录的变化，一旦发生变化，自动重启。如果要精确监听、不监听的目录，最好通过配置文件。
* -i --instances        启动多少个实例，可用于负载均衡。如果-i 0或者-i max，则根据当前机器核数确定实例数目。
* -ignore-watch         排除监听的目录/文件，可以是特定的文件名，也可以是正则。
* -n --name             应用的名称。查看应用信息的时候可以用到。
* -o --output <path>    标准输出日志文件的路径
* -e --error <path>     错误输出日志文件的路径
* --interpreter <interpreter>   the interpreter pm2 should use for executing app(bash, python...)

官方文档http://pm2.keymetrics.io/docs/usage/quick-start/#options

### 重启

pm2 restart app.js

### 停止

pm2 stop app_name | app_id
pm2 stop all

### 查看进程状态

pm2 list

## 配置文件

http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

### 负载均衡

http://pm2.keymetrics.io/docs/usage/cluster-mode/#automatic-load-balancing

### 传入node args

命令行：
pm2 start app.js --node-args="--harmony"
配置文件：
{"name": "oc-server", "script": "app.js", "node_args": "--harmony"}

### 远程部署

http://pm2.keymetrics.io/docs/usage/deployment/#getting-started

### 内存使用超过上限自动重启

pm2 start big-array.js --max-memory-restart 20M

### pm2编程接口

http://pm2.keymetrics.io/docs/usage/pm2-api/
