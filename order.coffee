minimatch = require('minimatch')
module.exports = (buffer,opts)->
  if !opts.order?
    return buffer
  if opts.order.constructor isnt Array
    opts.order = [opts.order]

  max_rank              = opts.order.length
  rank_object           = {}
  for filename, contents of buffer when buffer.hasOwnProperty(filename)
    rank_object[filename] = rank:max_rank, contents:contents

  for filename of rank_object when rank_object.hasOwnProperty(filename)
    
    for order_glob, order_rank in opts.order
      if minimatch(filename, order_glob)
        rank_object[filename].rank = order_rank
        break;

    
  ranked_array = for filename,value of rank_object when rank_object.hasOwnProperty(filename)
    filename:filename, rank:value.rank, contents:value.contents 
  sorted_array = ranked_array.sort (a,b)->

    if a.rank > b.rank
      1
    else if b.rank < a.rank
     -1
    else
      0

  sorted_buffer = {}
  sorted_buffer[item.filename] = item.contents for item in sorted_array
  return sorted_buffer