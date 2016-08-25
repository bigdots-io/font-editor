class Matrix {
  constructor(character, font, dimensions, coordinates) {
    this.character = character;
    this.dimensions = dimensions;
    this.font = font;
    this.coordinates = coordinates || [];
  }

  render({editable}) {
    this.$el = $(`<div data-character="${this.character}" class="matrix-frame" style="width: 140px">`);

    for(var y = 0; y < this.dimensions.height; y++) {
      var $row = $(`<div class="matrix-row">`);
      for(var x = 0; x < this.dimensions.width; x++) {
        $row.append(`
          <div class="matrix-dot-wrapper">
            <div class="matrix-dot" data-y="${y}" data-x="${x}"></div>
          </div>
        `);
      }
      this.$el.append($row);
    }

    this.$el.append(`
      <div class="matrix-character">
        <a href="${window.location.pathname}/character/${this.character}">${this.character}</a>
      </div>
    `);

    this.coordinates.forEach((coordinate) => {
      this.$el.find(`[data-y=${coordinate.y}][data-x=${coordinate.x}]`).addClass('on');
    });

    if(editable) {
      this.attachEvents();
    }

    return this;
  }

  attachEvents() {
    this.$el.find('.matrix-dot').click((ev) => {
      ev.preventDefault();

      var $el = $(ev.currentTarget),
          data = $el.data();

      $el.toggleClass('on');
      if($el.hasClass('on')) {
        this.coordinates.push({
          y: data.y,
          x: data.x,
          opacity: 1
        });
      } else {
        var index = this.coordinates.findIndex(function(coordinate) {
          return data.y === coordinate.y && data.x === coordinate.x;
        });
        this.coordinates.splice(index, 1);
      }

      $.ajax({
        type:'POST',
        url: `/${this.font}/character/${this.character}`,
        data: JSON.stringify({
          coordinates: this.coordinates
        }),
        contentType: 'application/json'
      });
    });
  }
}
