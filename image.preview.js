/* [https://github.com/sixem/image.preview.js] */

(function($)
{
  'use strict';

  $.fn.imagePreview = function(options)
  {
    var main = {
      loading : null,
      store : {},
      last : {},
      css : {
        required : {}
      }
    };

    main.settings = $.extend({
      hoverDelay : 75,
      staticPreview : true,
      windowMargin : 4,
      triggerMargin : 24,
      elements : [],
      extensions : {
          images : ['jpg', 'jpeg', 'gif', 'png', 'ico', 'svg', 'bmp'],
          videos : ['mp4', 'webm']
      },
    }, main.settings, options);

    main.css.required = {
          'max-height' : 'calc(100% - ' + (main.settings.windowMargin * 2) + 'px)',
          'visibility' : 'hidden',
          'position' : 'fixed',
          'top' : main.settings.windowMargin,
          'left' : 0,
          'z-index' : 9999,
          'pointer-events' : 'none'
    };

    main.refreshSettings = function()
    {
      main.css.required['max-height'] = ('calc(100% - ' + (main.settings.windowMargin * 2) + 'px)');
      main.css.required.top = main.settings.windowMargin;
    };

    main.isStatic = function()
    {
      return !main.settings.staticPreview && main.settings.mouse != undefined ? false : true;
    };

    main.arrayContains = function(t, e)
    {
        return $.inArray(t, e) > -1;
    };

    function getElementPositions(target)
    {
        var offsets = target.offset();

        return {
            'top' : offsets.top - main.windowScrollTop,
            'left' : offsets.left - main.windowScrollLeft,
            'offset' : offsets,
            'margin' : target.width() + main.settings.triggerMargin,
        };
    }

    function getTopAdjustments(max, top)
    {
      var perc = ((top / max) * 100); perc = perc > 100 ? 100 : perc;
      var calc = ((max / 100) * perc) - ((main.store.adjustedHeight / 100) * perc);

      main.current.css('max-height', max - (max - main.store.adjustedHeight) + 'px');

      return calc < main.settings.windowMargin ? main.settings.windowMargin : calc;
    }

    function previewAdjust()
    {
        if(main.current == undefined) return false;

        main.windowScrollTop = $(window).scrollTop(); main.windowScrollLeft = $(window).scrollLeft();

        if(!main.isStatic())
        {
          if(main.store.offset == undefined)
          {
            main.store.offset = {
              'top' : main.settings.mouse.pageY - main.windowScrollTop,
              'left' : main.settings.mouse.pageX - main.windowScrollLeft,
              'margin' : main.settings.triggerMargin
            };
          } else {
            main.store.offset.left = main.settings.mouse.pageX - main.windowScrollLeft;
          }
        } else {
          if(main.store.offset == undefined)
          {
            main.store.offset = getElementPositions(main.last.trigger);
          }
        }

        var pos;

        if(main.windowWidthH > main.windowWidth - main.store.offset.left)
        {
            pos = Math.floor(main.windowWidth - main.store.offset.left + main.settings.triggerMargin);

            main.current.css({
                'left' : '',
                'right' : pos + 'px',
                'max-width' : ((main.windowWidth - pos) - main.settings.windowMargin) + 'px'
            });
        } else {
            pos = Math.floor(main.store.offset.left + main.store.offset.margin);

            main.current.css({
                'left' : pos + 'px',
                'right' : '',
                'max-width' : ((main.windowWidth - pos) - main.settings.windowMargin) + 'px'
            });
        }

        if(main.store.currentTop == undefined)
        {
          var max = main.windowHeight - (main.settings.windowMargin * 2);

          main.store.adjustedHeight = main.current.height();

          if(main.store.adjustedHeight < max)
          {
            main.store.currentTop = getTopAdjustments(max, main.store.offset.top);

            main.current.css('top', main.store.currentTop + 'px');
          }
        }

        main.current.css('visibility', 'visible'); main.visible = true;
    }

    function previewShow(enable)
    {
      if(enable === false)
      {
        var previews = $('body').find('#video-preview, #image-preview');

        if(previews.length > 0) previews.remove();

        main.visible = false;
        main.current = main.last.src = undefined;

        main.store = {
          adjustedHeight : 0,
          currentHeight : 0,
          currentWidth : 0,
          currentTop : undefined
        };

        return false;
      }

      var data, attr;

      data = main.last.trigger.data('preview');

      if(data !== false && data !== undefined)
      {
        main.last.src = main.last.trigger.data('preview');
      } else {
        if(main.last.trigger.is('img'))
        {
          attr = main.last.trigger.attr('src');
        } else {
          attr = main.last.trigger.attr('href');
        }

        if(typeof attr !== typeof undefined && attr !== false) main.last.src = attr;
      }

      if(main.last.src == undefined) return false;

      main.last.ext = main.last.src.split('.').pop().toLowerCase();

      if(main.arrayContains(main.last.ext, main.settings.extensions.images))
      {
        if(main.loading === null)
        {
          $(main).trigger('loadChange', true); main.loading = true;
        }

        var img = new Image(); img.orig = main.last.src;

        $(img).on('load', function()
        {
          if(!main.visible)
          {
            if(this.orig == main.last.src)
            {
              var image = $('<img>', {
                id : 'image-preview',
                src : img.src
              }).appendTo($('body'));

              main.current = image;

              main.current.on('load', function()
              {
                main.getDimensions();
              });

              if(main.settings.css != undefined)
              {
                main.current.css(main.css.required).css(main.settings.css);
              } else {
                main.current.css(main.css.required);
              }

              if(main.loading !== null)
              {
                $(main).trigger('loadChange', false); main.loading = null;
              }

              $(main).trigger(
                'loaded', {
                  itemType : 0,
                  element : image,
                  source : this.orig,
                  dimensions : {
                    width : this.width,
                    height : this.height
                  }
                }
              );
            }

            return true;
          }
        });

        img.src = main.last.src;
      }

      if(main.arrayContains(main.last.ext, main.settings.extensions.videos))
      {
        if(main.loading === null)
        {
          $(main).trigger('loadChange', true); main.loading = true;
        }

        var video = $('<video/>', {
          id : 'video-preview',
          controls : '',
          loop : '',
          muted : '',
          autoplay : ''
        }).prependTo($('body'));

        var source = $('<source>', {
          src : ''
        }).prependTo(video);

        main.current = video;

        video.attr('data-orig', main.last.src);
        source.attr('src', main.last.src);

        if(main.settings.css != undefined)
        {
          video.css(main.css.required).css(main.settings.css);
        } else {
          video.css(main.css.required);
        }

        video[0].muted = true;
        video[0].load();

        main.waitForVideo(video);
      }
    }

    main.waitForVideo = function(video)
    {
      function checkLoad()
      {
        if(main.current == undefined || video.data('orig') != main.last.src) return false;

        if(video.prop('readyState') >= 3 && video.width() > 0 && video.height() > 0)
        {
          video.one('seeked').prop('currentTime', 0);

          main.currentWidth = video.width();
          main.store.currentHeight = video.height();

          previewAdjust(main.isStatic() ? undefined : 1);

          video[0].play();

          $(main).trigger('loadChange', false);

          if(main.loading !== null)
          {
            $(main).trigger('loadChange', false); main.loading = null;
          }

          $(main).trigger(
            'loaded', {
              itemType : 1,
              element : video,
              source : video.data('orig'),
              dimensions : {
                width : video.width(),
                height : video.height()
              }
            }
          );

          return true;
        } else {
          setTimeout(checkLoad, 150);
        }
      }

      checkLoad();
    };

    main.getDimensions = function()
    {
      function checkLoad()
      {
        if(main.current == undefined) return false;

        if(main.current.width() > 0 && main.current.height() > 0)
        {
          main.currentWidth = main.current.width();
          main.store.currentHeight = main.current.height();

          previewAdjust(main.isStatic() ? undefined : 1);

          return true;
        } else {
          setTimeout(checkLoad, 150);
        }
      }

      checkLoad();
    };

    function getWindowDimensions()
    {
      main.windowWidth = $(window).width(); main.windowHeight = $(window).height(); main.windowWidthH = $(window).width() / 2;
    }

    function bindHandlers()
    {
      if(main.settings.elements.length < 1) return false;

      getWindowDimensions();

      $.each(main.settings.elements, function(index, value)
      {
        $(document)
        .off('mouseenter', value)
        .on('mouseenter', value, function(e)
        {
          main.last.trigger = $(this);

          main.timer = setTimeout(
            function()
            {
              if(!main.visible)
              {
                previewShow();
              } else {
                return true;
              }
            }, main.settings.hoverDelay
          );
        });

        $(document)
        .off('mouseleave', value)
        .on('mouseleave', value, function(e)
        {
            if(main.loading !== null)
            {
              $(main).trigger('loadChange', false); main.loading = null;
            }
            clearTimeout(main.timer); previewShow(false);
        });

        $(window)
        .off('resize')
        .on('resize',function()
        {
          if(main.resizeTimer !== undefined) clearTimeout(main.resizeTimer);
            
          main.resizeTimer = setTimeout(
            function()
            {
              getWindowDimensions();
            }, 250
          );
        });

        if(!main.settings.staticPreview)
        {
          $(document)
          .off('mousemove', value)
          .on('mousemove', value, function(e)
          {
              main.settings.mouse = e;

              if(main.visible) previewAdjust(1);
          });
        }
      });
    }

    bindHandlers(); return main;
  };
}(jQuery));