/* [https://github.com/sixem/image.preview.js] */

(function($)
{
  $.fn.imagePreview = function(options)
  {
    var ipjs = this;

    ipjs.settings = $.extend({
      hoverDelay : 150,
      staticPreview : true,
      windowMargin : 4,
      triggerMargin : 24,
      elements : [],
      extensions : {
          images : ['jpg', 'jpeg', 'gif', 'png', 'ico', 'svg', 'bmp'],
          videos : ['mp4', 'webm']
      },
    }, ipjs.settings, options);

    ipjs.store = {};

    ipjs.requiredCSS = {
          'max-height' : 'calc(100% - ' + (ipjs.settings.windowMargin * 2) + 'px)',
          'visibility' : 'hidden',
          'position' : 'fixed',
          'top' : ipjs.settings.windowMargin,
          'left' : 0,
          'z-index' : 4,
          'pointer-events' : 'none'
    };

    function isStatic()
    {
      return !ipjs.settings.staticPreview && ipjs.settings.mouse != undefined ? false : true;
    }

    function arrayContains(t, e)
    {
        return $.inArray(t, e) > -1;
    }

    function getElementPositions($t)
    {
        $offsets = $t.offset();

        return {
            'top' : $offsets.top - ipjs.windowScrollTop,
            'left' : $offsets.left - ipjs.windowScrollLeft,
            'offset' : $offsets,
            'margin' : $t.width() + ipjs.settings.triggerMargin,
        };
    }

    function getTopAdjustments($max, $top)
    {
      $perc = (($top / $max) * 100); $perc = $perc > 100 ? 100 : $perc;
      $calc = (($max / 100) * $perc) - ((ipjs.store['adjustedHeight'] / 100) * $perc);

      ipjs.current.css('max-height', $max - ($max - ipjs.store['adjustedHeight']) + 'px');

      return $calc < ipjs.settings.windowMargin ? ipjs.settings.windowMargin : $calc;
    }

    function previewAdjust($e)
    {
        if(ipjs.current == undefined)
        {
            return false;
        }

        ipjs.windowScrollTop = $(window).scrollTop(); ipjs.windowScrollLeft = $(window).scrollLeft();

        if(!isStatic())
        {
          if(ipjs.store['offset'] == undefined)
          {
            $offsets = ipjs.lastTrigger.offset();

            ipjs.store['offset'] = {
              'top' : ipjs.settings.mouse.pageY - ipjs.windowScrollTop,
              'left' : ipjs.settings.mouse.pageX - ipjs.windowScrollLeft,
              'margin' : ipjs.settings.triggerMargin
            };
          } else {
            ipjs.store['offset']['left'] = ipjs.settings.mouse.pageX - ipjs.windowScrollLeft;
          }
        } else {
          if(ipjs.store['offset'] == undefined)
          {
            ipjs.store['offset'] = getElementPositions(ipjs.lastTrigger);
          }
        }

        if(ipjs.windowWidthH > ipjs.windowWidth - ipjs.store['offset']['left'])
        {
            $pos = Math.floor(ipjs.windowWidth - ipjs.store['offset']['left'] + ipjs.settings.triggerMargin);

            ipjs.current.css({
                'left' : '',
                'right' : $pos + 'px',
                'max-width' : ((ipjs.windowWidth - $pos) - ipjs.settings.windowMargin) + 'px'
            });
        } else {
            $pos = Math.floor(ipjs.store['offset']['left'] + ipjs.store['offset']['margin']);

            ipjs.current.css({
                'left' : $pos + 'px',
                'right' : '',
                'max-width' : ((ipjs.windowWidth - $pos) - ipjs.settings.windowMargin) + 'px'
            });
        }

        if(ipjs.store['currentTop'] == undefined)
        {
          $max = ipjs.windowHeight - (ipjs.settings.windowMargin * 2);

          ipjs.store['adjustedHeight'] = ipjs.current.height();

          if(ipjs.store['adjustedHeight'] < $max)
          {
            ipjs.store['currentTop'] = getTopAdjustments($max, ipjs.store['offset']['top']);

            ipjs.current.css('top', ipjs.store['currentTop'] + 'px');
          }
        }

        ipjs.current.css('visibility', 'visible'); ipjs.visible = true;
    }

    function previewShow(enable)
    {
      if(enable === false)
      {
        $previews = $('body').find('#video-preview, #image-preview');

        if($previews.length > 0)
        {
          $previews.remove();
        }

        ipjs.visible = false;
        ipjs.current = ipjs.lastSrc = undefined;

        ipjs.store = {
          adjustedHeight : 0,
          currentHeight : 0,
          currentWidth : 0,
          currentTop : undefined
        };

        return false;
      }

      $data = ipjs.lastTrigger.data('preview');

      if($data !== false && $data !== undefined)
      {
        ipjs.lastSrc = ipjs.lastTrigger.data('preview');
      } else {
        if(ipjs.lastTrigger.is('img'))
        {
          $attr = ipjs.lastTrigger.attr('src');
        } else {
          $attr = ipjs.lastTrigger.attr('href');
        }

        if(typeof $attr !== typeof undefined && $attr !== false)
        {
          ipjs.lastSrc = $attr;
        }
      }

      if(ipjs.lastSrc == undefined)
      {
        return false;
      }

      ipjs.lastExt = ipjs.lastSrc.split('.').pop().toLowerCase();

      if(arrayContains(ipjs.lastExt, ipjs.settings.extensions.images))
      {
        img = new Image(); img.orig = ipjs.lastSrc;

        $(img).on('load', function()
        {
          if(!ipjs.visible)
          {
            if(this.orig == ipjs.lastSrc)
            {
              $('body').prepend('<img id="image-preview" src="' + img.src + '">');

              ipjs.current = $('body').find('#image-preview');

              ipjs.current.on('load', function()
              {
                $(document).imagePreview.getDimensions();
              });

              if(ipjs.settings.css != undefined)
              {
                ipjs.current.css(ipjs.requiredCSS).css(ipjs.settings.css);
              } else {
                ipjs.current.css(ipjs.requiredCSS);
              }
            }

            return true;
          }
        });

        img.src = ipjs.lastSrc;
      }

      if(arrayContains(ipjs.lastExt, ipjs.settings.extensions.videos))
      {
        $('body').prepend('<video id="video-preview" controls loop muted autoplay><source src=""></video>');

        $video = $('body').find('#video-preview').first();

        ipjs.current = $video;

        $video.attr('data-orig', ipjs.lastSrc);
        $video.find('source').attr('src', ipjs.lastSrc);

        if(ipjs.settings.css != undefined)
        {
          $video.css(ipjs.requiredCSS).css(ipjs.settings.css);
        } else {
          $video.css(ipjs.requiredCSS);
        }

        $video[0].load();

        waitForVideo($video);
      }
    }

    function waitForVideo($video)
    {
      function checkLoad()
      {
        if(ipjs.current == undefined || $video.data('orig') != ipjs.lastSrc)
        {
          return false;
        }

        if($video.prop('readyState') >= 3 && $video.width() > 0 && $video.height() > 0)
        {
          $video.one('seeked').prop('currentTime', 0);

          ipjs.currentWidth = $video.width();
          ipjs.store['currentHeight'] = $video.height();

          previewAdjust(isStatic() ? undefined : 1);

          return true;
        } else {
          setTimeout(checkLoad, 150);
        }
      }

      checkLoad();
    };

    $.fn.imagePreview.getDimensions = function()
    {
      function checkLoad()
      {
        if(ipjs.current == undefined)
        {
          return false;
        }

        if(ipjs.current.width() > 0 && ipjs.current.height() > 0)
        {
          ipjs.currentWidth = ipjs.current.width();
          ipjs.store['currentHeight'] = ipjs.current.height();

          previewAdjust(isStatic() ? undefined : 1);

          return true;
        } else {
          setTimeout(checkLoad, 150);
        }
      }

      checkLoad();
    };

    function getWindowDimensions()
    {
      ipjs.windowWidth = $(window).width(); ipjs.windowHeight = $(window).height(); ipjs.windowWidthH = $(window).width() / 2;
    }

    function bindHandlers()
    {
      if(ipjs.settings.elements.length < 1)
      {
        return false;
      }

      getWindowDimensions();

      $.each(ipjs.settings.elements, function(index, value)
      {
        $(document).off('mouseenter mouseleave mousemove', value);

        $(document).on('mouseenter', value, function(e)
        {
          ipjs.lastTrigger = $(this);

          ipjs.timer = setTimeout(
            function()
            {
              if(!ipjs.visible)
              {
                previewShow();
              } else {
                return true;
              }
            }, ipjs.settings.hoverDelay
          );
        });

        $(document).on('mouseleave', value, function(e)
        {
            clearTimeout(ipjs.timer); previewShow(false);
        });

        $(window).off('resize');

        $(window).on('resize',function()
        {
          if(ipjs.resizeTimer !== undefined)
          {
            clearTimeout(ipjs.resizeTimer);
          }
            
          ipjs.resizeTimer = setTimeout(
            function()
            {
              getWindowDimensions();
            }, 250
          );
        });

        if(!ipjs.settings.staticPreview)
        {
          $(document).on('mousemove', value, function(e)
          {
              ipjs.settings.mouse = e;

              if(ipjs.visible)
              {
                previewAdjust(1);
              }
          });
        }
      });
    }

    this.unbind = function()
    {
      $.each(ipjs.settings.elements, function(index, value)
      {
        $(document).off('mouseenter mouseleave mousemove', value);
      });
    };

    bindHandlers(); return this;
  };

}(jQuery));