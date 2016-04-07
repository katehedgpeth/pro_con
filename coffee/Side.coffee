class proCon.Side extends proCon.Observable
  constructor: ->
    super
    @model ||= proCon.Item
    @id ||= '.side'
    @el = @build { node: @id }
    @addButton = @build { node: 'a.add', textContent: '+ Add another item' }
    @el.appendChild @addButton
    @items = []
    @value = 0
    @getLocalStorage()
    @addItem()
    @applyHandlers()

  getLocalStorage: ->
    storage = _.chain(localStorage).clone().toArray().value()
    localStorage.clear()
    for item in storage
      data = JSON.parse item
      newModel = @addItem()
      newModel.editEl.value = data.name
      newModel.valueEl.value = data.value
      newModel.onSaveClicked()


  applyHandlers: ->
    @addButton.addEventListener 'click', @addItem
    window.addEventListener 'keyup', @handleShortcuts

  addItem: =>
    newModel = new @model()
    newModel.on 'save', @onSaveItem
    newModel.on 'remove', @onRemoveItem
    newModel.on 'update', @updateValue
    @el.appendChild newModel.container
    @el.appendChild @addButton
    newModel.editEl.focus()
    @items.push newModel
    newModel

  onSaveItem: =>
    @removeEmpty()
    @addItem()
    @el.appendChild @addButton
    @updateValue()

  onRemoveItem: (id) =>
    @items.splice @items.findIndex((d) -> d.id is id), 1
    @updateValue()
    @addItem() if @items.length is 0

  updateValue: =>
    @value = 0
    for item in @items
      @value += parseInt(item.valueEl.value, 10)
    @fire 'recalculate'

  sortItems: =>
    @items.forEach (item) -> item.container.remove()
    sortable = @items.filter (item) -> item.editEl.value != ''
    empty = @items.filter (item) -> item.editEl.value is ''
    @addButton.remove()
    sortable.sort (a, b) -> if a.value > b.value then -1 else if b.value > a.value then 1 else if b.value == a.value then 0
    sortable.forEach (item) => @el.appendChild(item.container)
    localStorage.clear()
    item.setLocalStorage() for item in sortable
    empty.forEach (item) => @el.appendChild(item.container)
    @el.appendChild(@addButton)

  createRandomItem: (e) ->
    item = @addItem()
    item.valueEl.value = _.random(parseInt(item.valueEl.getAttribute('min'), 10), parseInt(item.valueEl.getAttribute('max'), 10))
    item.editEl.value = proCon.words(Math.random() * 20).join(' ')
    item.onSaveClicked(e)
    @updateValue()

  removeEmpty: ->
    empty = @items.filter( (item) -> item.editEl.value is '')[0]
    if empty
      empty.container.remove()
      @items.splice @items.findIndex((d) -> d.id is empty.id), 1


  handleShortcuts: (e) =>
    @addItem() if e.keyCode is 78
    @removeEmpty() if e.keyCode is 27
    @sortItems() if e.keyCode is 83
    console.log e.keyCode