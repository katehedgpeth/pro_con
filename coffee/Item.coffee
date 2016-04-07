class proCon.Item extends proCon.Observable
  constructor: ->
    super
    @value = 0
    proCon.itemCount ||= 0
    @id = proCon.itemCount
    proCon.itemCount += 1
    @editEl = @build({
      node: 'input.name'
      attributes: { type: 'text', placeholder: 'type something here' }
    })
    @removeBtn = @build({
      node: 'a.remove'
      textContent: 'X'
    })
    @showEl = @build node: 'p.name'
    @valueEl = @build({
      node: 'input.value'
      attributes: { min: -20, max: 20, 'value': 0, type: 'range' }
    })
    @container = @build node: 'form.item'
    @container.appendChild @removeBtn
    @container.appendChild @editEl
    @container.appendChild @valueEl
    @applyHandlers()

  applyHandlers: ->
    @container.addEventListener 'submit', @onSaveClicked
    @removeBtn.addEventListener 'click', @onRemoveClicked
    @valueEl.addEventListener 'change', @onRangeChanged
    @editEl.addEventListener 'keyup', @onInputKeyup

  onSaveClicked: (e) =>
    e.preventDefault() if e
    @name = @editEl.value
    @value = @valueEl.valueAsNumber
    @setLocalStorage()
    @showEl.textContent = @name
    @editEl.remove()
    @container.appendChild @showEl
    @container.appendChild @valueEl
    @fire('save', this) if e

  onRemoveClicked: =>
    @container.remove()
    window.localStorage.removeItem "proCon#{@id}"
    @fire 'remove', this.id

  onRangeChanged: =>
    @editEl.focus()
    @value = @valueEl.valueAsNumber
    @setLocalStorage()
    if @editEl.value != @name and @editEl.value != '' then @onSaveClicked() else @fire 'update'

  setLocalStorage: ->
    val = JSON.stringify {value: @value, name: @name }
    window.localStorage.setItem "proCon#{@id}", val

  onInputKeyup: (e) ->
    e.cancelBubble = true unless e.keyCode is 27