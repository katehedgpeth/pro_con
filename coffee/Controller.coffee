class proCon.Controller extends proCon.Observable
  constructor: ->
    @list = new proCon.Side()
    # @pros = new proCon.Pros()
    # @cons = new proCon.Cons()
    # @totalValue = @build node: '.total'
    @applyHandlers()

  applyHandlers: ->
    window.addEventListener 'load', @render
    @list.on 'recalculate', @recalculate
    # @pros.on 'recalculate', @recalculate
    # @cons.on 'recalculate', @recalculate

  render: =>
    document.querySelector('#sides').appendChild @list.el
    @decisionEl = document.querySelector('#decision')
    @sortBtn = document.querySelector('#sort')
    @sortBtn.addEventListener 'click', @list.sortItems
    @list.updateValue()
    # document.querySelector('#cons').appendChild @cons.el
    # document.querySelector('#pros').appendChild @pros.el
    # document.body.appendChild @totalValue

  recalculate: =>
    @getGroups()
    scale = @pros.value + @cons.value
    pct = if @pros.value is @cons.value then 50 else @pros.value / scale * 100
    document.querySelector('#bar').setAttribute 'style', "width:#{pct}%"
    console.log pct
    @setText(pct)

  getGroups: ->
    @pros = []
    @pros.value = 0
    @cons = []
    @cons.value = 0
    @list.items.map (item) =>
      val = item.value.valueOf() || 0
      if val > 0
        @pros.push(item)
        @pros.value += val
      else
        val = -val if val < 0
        @cons.push(item)
        @cons.value += val

  setText: (pct) ->
    if pct >= 85 then text = 'You should definitely do it!'
    if pct < 85 and pct >= 65 then text = 'You should probably do it.'
    if pct < 65 and pct >= 35 then text = 'You should think about it some more.'
    if pct < 35 and pct >= 15 then text = 'You probably shouldn\'t do it.'
    if pct < 15 and pct >= 0 then text = 'You definitely shouldn\'t do it.'
    @decisionEl.textContent = text

