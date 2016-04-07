class proCon.Observable
  on: (event, handler) ->
    (@events ||= {})[event] ||= $.Callbacks()
    @events[event].add(handler)

  fire: (event, params...) ->
    @events[event].fire(params...) if @events and @events[event]?

  build: (opts) ->
    opts.node = 'div' if !opts.node
    el = @parseElNode(opts.node)
    _.each( opts.attributes, (val, key) -> el.setAttribute(key, val)) if opts.attributes
    _.each( opts.data, (val, key) -> el.dataset[key] = val) if opts.data
    el.textContent = opts.textContent if opts.textContent
    el.href = 'javascript:void(0)' if el.nodeName is 'A' and el.href is ''
    if opts.children?
      for child in opts.children
        childEl = @build(child)
        el.appendChild(childEl)
    @[opts.variable] = el if opts.variable
    el

  parseElNode: (node) ->
    idStart = node.indexOf('#')
    classStart = node.indexOf('.')
    if idStart isnt -1
      stop = if classStart isnt -1 and (idStart < classStart) then idStart else node.length
      id = node.slice(idStart + 1, stop)
    if classStart isnt -1
      stop = if idStart isnt -1 and (classStart < idStart) then idStart else node.length
      classes = node.slice(classStart, stop).replace(/\./g, ' ').trim()
    if node[0] is '#' or node[0] is '.'
      nodeType = 'div'
    else
      end = node.search(/\W/)
      nodeType = if end isnt -1 then node.slice(0, end) else node
    el = document.createElement nodeType
    if classes then el.setAttribute 'class', classes
    if id then el.setAttribute 'id', id
    el
