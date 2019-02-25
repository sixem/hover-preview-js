/* [https://github.com/sixem/image.preview.js] */

(function($)
{
  $.fn.imagePreview = function(options)
  {
    var ipjs = this;

    ipjs.settings = $.extend({
      hoverDelay : 150,
      margin : 4,
      elements : [],
      extensions : {
          images : ['jpg', 'jpeg', 'gif', 'png', 'ico', 'svg', 'bmp'],
          videos : ['mp4', 'webm']
      },
    }, ipjs.settings, options);

    ipjs.settings.styles = {
          'max-height' : 'calc(100% - ' + (ipjs.settings.margin * 2) + 'px)',
          'visibility' : 'hidden',
          'position' : 'fixed',
          'top' : ipjs.settings.margin,
          'left' : 0,
          'z-index' : 4
    };

    function arrayContains(t, e)
    {
        return $.inArray(t, e) > -1;
    }

    function getElementPositions($t)
    {
        $offsets = $t.offset();

        return {
            'top' : $offsets.top - $(window).scrollTop(),
            'left' : $offsets.left - $(window).scrollLeft(),
            'offset' : $offsets
        };
    }

    function previewAdjust()
    {
        if(ipjs.current == undefined)
        {
            return false;
        }

        $ww = $(window).width();

        $offset = getElementPositions(ipjs.lastTrigger);

        if(($ww / 2) > $ww - $offset['left'])
        {
            $pos = Math.floor($ww - $offset['left'] + 10);

            ipjs.current.css({
                'left' : '',
                'right' : $pos + 'px',
                'max-width' : (($ww - $pos) - ipjs.settings.margin) + 'px'
            });
        } else {
            $pos = Math.floor($offset['left'] + ipjs.lastTrigger.width() + 10);

            ipjs.current.css({
                'left' : $pos + 'px',
                'right' : '',
                'max-width' : (($ww - $pos) - ipjs.settings.margin) + 'px'
            });
        }

        if(ipjs.current.height() < ipjs.currentHeight)
        {
            ipjs.currentHeight = ipjs.current.height();
        }

        $x = ($offset['top'] - ipjs.currentHeight);

        if($x > 10)
        {
            ipjs.current.css('margin-top', $x + 'px');
        }

        ipjs.current.css('visibility', 'visible');

        ipjs.visible = true;
    }

    function previewShow(enable)
    {
      if(enable == false)
      {
        $previews = $('body').find('#video-preview, #image-preview');

        if($previews.length > 0)
        {
          $previews.remove();
        }

        ipjs.visible = false;
        ipjs.current = ipjs.lastSrc = undefined;
        ipjs.currentHeight = ipjs.currentWidth = 0;

        return false;
      }

      $data = ipjs.lastTrigger.data('preview');

      if($data !== false && $data !== undefined)
      {
        ipjs.lastSrc = ipjs.lastTrigger.data('preview');
      } else {

        $attr = ipjs.lastTrigger.attr('href');

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
                ipjs.current.css(ipjs.settings.styles).css(ipjs.settings.css);
              } else {
                ipjs.current.css(ipjs.settings.styles);
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
          $video.css(ipjs.settings.styles).css(ipjs.settings.css);
        } else {
          $video.css(ipjs.settings.styles);
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

        if($video.prop('readyState') > 3 && $video.width() > 0 && $video.height() > 0)
        {
          $video.one('seeked').prop('currentTime', 0);

          ipjs.currentWidth = $video.width();
          ipjs.currentHeight = $video.height();

          previewAdjust();

          return true;
        } else {
          setTimeout(checkLoad, 100);
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
          ipjs.currentHeight = ipjs.current.height();

          previewAdjust();

          return true;
        } else {
          setTimeout(checkLoad, 100);
        }
      }

      checkLoad();
    };

    function bindHandlers()
    {
      if(ipjs.settings.elements.length < 1)
      {
        return false;
      }

      $.each(ipjs.settings.elements, function(index, value)
      {
        $target = $(document).find(value);

        if($target.length > 0)
        {
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
        }
      });
    }

    bindHandlers();
  };

}(jQuery));
