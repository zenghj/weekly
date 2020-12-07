const fs = require('fs');

function parse(content = '') {
  let date = content.match(/\#*([^\n]*)/)

  const blocks = content.split(/##[^\n]*\n/).slice(1);
  const result = {
    date: date.trim(),
    blocks: []
  };
  blocks.forEach((b, i) => {
    const lines = b.split('\n')
    const list = []
    lines.forEach(line => {
      list.push(parseLine(line))
    })
    result.blocks[i] = {
      level: i,
      items: list.filter(Boolean)
    }
  })
  
}

function parseLine(line = '') {

}