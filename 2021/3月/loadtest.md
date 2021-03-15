让我们在两个应用程序上进行负载测试，以便了解每个应用程序如何处理大量传入连接。我们将为此使用 loadtest 依赖包。

通过 loadtest 依赖包，你可以模拟与 API 的大量并发连接，从而可以评估其性能。

要使用 loadtest，首先需要全局安装它：

```shell
$ npm install -g loadtest
```

然后，使用 node app.js 运行要测试的应用程序。我们将首先测试不使用集群的版本。

在应用程序运行的情况下，打开另一个终端并运行以下负载测试：

```shell
$ loadtest http://localhost:3000/api/500000 -n 1000 -c 100
```

上面的命令会将 1000 个请求发送到给定的 URL，其中 1000 个是并发的。以下是运行上述命令的输出结果：

```
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Target URL:          http://localhost:3000/api/500000
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          1.268364041 s
Requests per second: 788
Mean latency:        119.4 ms

Percentage of the requests served within a certain time 50%      121 ms
  90%      132 ms
  95%      135 ms
  99%      141 ms
 100%      142 ms (longest request)
```

我们看到，使用相同的请求（n = 500000），服务器能够每秒处理 788 个请求，平均等待时间为 119.4 毫秒（完成单个请求所需的平均时间）。

让我们再试一次，但是这次是更多请求（并且没有集群）：

```shell
$ loadtest http://localhost:3000/api/5000000 -n 1000 -c 100
```

以下是输出结果：

```
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms
Requests: 573 (57%), requests per second: 115, mean latency: 798.3 ms

Target URL:          http://localhost:3000/api/5000000
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          8.740058135 s
Requests per second: 114
Mean latency:        828.9 ms

Percentage of the requests served within a certain time 50%      869 ms
  90%      874 ms
  95%      876 ms
  99%      879 ms
 100%      880 ms (longest request)
```

对于 n = 5000000 的请求，服务器每秒可以处理 114 个请求，平均等待时间为 828.9 毫秒。
让我们将此结果与使用集群的应用程序进行比较。
停止非集群应用程序，运行集群应用程序，最后运行相同的负载测试。
以下是 http://localhost:3000/api/500000 的测试结果：

```
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Target URL:          http://localhost:3000/api/500000
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          0.701446328 s
Requests per second: 1426
Mean latency:        65 ms

Percentage of the requests served within a certain time 50%      61 ms
  90%      81 ms
  95%      90 ms
  99%      106 ms
 100%      112 ms (longest request)
```

经过相同请求的测试（当 n = 500000 时），使用集群的应用程序每秒可以处理 1426 个请求 —— 与不包含集群的应用程序每秒 788 个请求相比，显着增加。使用集群的应用程序平均延迟为 65 毫秒，而没有使用集群的应用程序的平均延迟为 119.4。你可以清楚地看到集群为应用程序带来的改进效果。

以下是对 http://localhost:3000/api/5000000 的测试结果：

```
Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Target URL:          http://localhost:3000/api/5000000
Max requests:        1000
Concurrency level:   100
Agent:               none

Completed requests:  1000
Total errors:        0
Total time:          2.43770738 s
Requests per second: 410
Mean latency:        229.9 ms

Percentage of the requests served within a certain time 50%      235 ms
  90%      253 ms
  95%      259 ms
  99%      355 ms
 100%      421 ms (longest request)
```
