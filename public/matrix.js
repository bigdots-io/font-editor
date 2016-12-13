class Matrix {
  constructor(character, font, dimensions, coordinates, dotConfig) {
    this.character = character;
    this.dimensions = dimensions;
    this.font = font;
    this.coordinates = coordinates || [];
    this.dotConfig = dotConfig;
  }

  render({editable}) {
    var width = (this.dotConfig.size + (this.dotConfig.padding * 2)) * this.dimensions.width;
    this.$el = $(`<div data-character="${this.character}" class="matrix-frame" style="width: ${width}px">`);

    for(var y = 0; y < this.dimensions.height; y++) {
      var $row = $(`<div class="matrix-row">`);
      for(var x = 0; x < this.dimensions.width; x++) {
        $row.append(`
          <div class="matrix-dot-wrapper" style="padding: ${this.dotConfig.padding}">
            <div class="matrix-dot" data-y="${y}" data-x="${x}" style="width: ${this.dotConfig.size}; height: ${this.dotConfig.size};"></div>
          </div>
        `);
      }
      this.$el.append($row);
    }

    this.$el.append(`
      <div class="matrix-character">
        <a href="${window.location.pathname}/characters/${encodeURIComponent(this.character)}">${this.character}</a>
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
    // this.$el.find('.matrix-dot').mousedown((ev) => {
    //   console.log('mouse down');
    //   this.dragging = true;
    //   this.toggleOn = !$(ev.target).hasClass('on');
    //
    //   var $el = $(ev.target),
    //       data = $el.data();
    //
    //   if(this.toggleOn) {
    //     $el.addClass('on');
    //     this.coordinates.push({
    //       y: data.y,
    //       x: data.x,
    //       opacity: 1
    //     });
    //   } else {
    //     $el.removeClass('on');
    //     var index = this.coordinates.findIndex(function(coordinate) {
    //       return data.y === coordinate.y && data.x === coordinate.x;
    //     });
    //     this.coordinates.splice(index, 1);
    //   }
    // });
    //
    // $(document).mousemove((ev) => {
    //   if(this.dragging) {
    //     if($(ev.target).hasClass('matrix-dot')) {
    //       var $el = $(ev.target),
    //           data = $el.data();
    //
    //       if(this.toggleOn) {
    //         $el.addClass('on');
    //         this.coordinates.push({
    //           y: data.y,
    //           x: data.x,
    //           opacity: 1
    //         });
    //       } else {
    //         $el.removeClass('on');
    //         var index = this.coordinates.findIndex(function(coordinate) {
    //           return data.y === coordinate.y && data.x === coordinate.x;
    //         });
    //         this.coordinates.splice(index, 1);
    //       }
    //     }
    //   }
    // });
    //
    // $(document).mouseup((ev) => {
    //   if(this.dragging) {
    //     this.dragging = false
    //     $.ajax({
    //       type:'POST',
    //       url: `/${this.font}/characters/${encodeURIComponent(this.character)}/coordinates`,
    //       data: JSON.stringify(this.coordinates),
    //       contentType: 'application/json'
    //     });
    //   }
    // });

    this.$el.find('.matrix-dot').click((ev) => {
      this.dragging = false
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
        url: `/fonts/${this.font}/characters/${encodeURIComponent(this.character)}/coordinates`,
        data: JSON.stringify(this.coordinates),
        contentType: 'application/json'
      });
    });
  }
}
