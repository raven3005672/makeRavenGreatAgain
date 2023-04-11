// npm install markdown-it@12.0.6 -D 

module.exports = function ModifyStructure(html) {
  // 把h3和h2开头的切成数组
  const htmlList = html.replace(/<h3/g, '$*(<h3').replace(/<h2/g, '$*(<h2').split('$*(')

  // 给他们套上 .card 类名的 div
  return htmlList
    .map(item => {
      if (item.indexOf('<h3') !== -1) {
        return `<div class="card card-3">${item}</div>`
      } else if (item.indexOf('<h2') !== -1) {
        return `<div class="card card-2">${item}</div>`
      }
      return item
    })
    .join('')
}



const { getOptions } = require('loader-utils')
const MarkdownIt = require('markdown-it')
const beautify = require('./beautify')
module.exports = function (source) {
  const options = getOptions(this) || {}
  const md = new MarkdownIt({
    html: true,
    ...options,
  })
  let html = beautify(md.render(source))
  html = `module.exports = ${JSON.stringify(html)}`
  this.callback(null, html)
}
