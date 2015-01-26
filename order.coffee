# order:["require.js", "unmatched_files", "index.js"]

minimatch = require('minimatch')
module.exports = (buffer,opts)->
  
  if !opts.order?
    return buffer
  
  if opts.order.constructor isnt Array
    opts.order = [opts.order]

  index_of_unmatched = opts.order.indexOf("unmatched_files")
  if index_of_unmatched is -1 then index_of_unmatched = null

  unmatched_rank        = if index_of_unmatched? then index_of_unmatched else opts.order.length
  rank_object           = {}


  
  for own filename, contents of buffer
    rank_object[filename] = rank:unmatched_rank, contents:contents

  for own filename of rank_object
    for order_glob, order_rank in opts.order
      if minimatch(filename, order_glob)
        rank_object[filename].rank = order_rank
        break

  
  ranked_array = for own filename,value of rank_object
    filename:filename, rank:value.rank, contents:value.contents 

  sorted_array = ranked_array.sort (a,b)-> a.rank-b.rank
  
  sorted_buffer = {}
  sorted_buffer[item.filename] = item.contents for item in sorted_array
  return sorted_buffer