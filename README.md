# image.preview.js
A simple jQuery plugin that adds hoverable image and video previews to links and other elements. 

## Installation
This script depends on [jQuery](https://github.com/jquery/jquery).

#### Script
Download and include the script in your web page.
```
curl -LO https://raw.github.com/sixem/image.preview.js/master/image.preview.js
```
##### Minified version.
```
curl -LO https://raw.github.com/sixem/image.preview.js/master/image.preview.min.js
```
## Usage
The simplest way to use this plugin is to initialize it when the page is done loading.
```
$(document).ready(function()
{
	$(document).imagePreview({
		elements : ['a.preview', 'div.preview']
	});
});
```
The `elements` parameters are the elements that you want to have an image or video preview. `elements : ['a']` will apply it to every link on the page while `elements : ['a.preview']` will apply it to all links with the `preview` class etc.

The plugin will use the image or video URL stored in the `href` attribute, if no `href` attribute is found it'll instead look for a `data-preview` attribute, this is what you want to use if you are using elements that aren't `a` elements.
### Options
There are a few options that can be passed to the script in order to customzie it a little bit.
#### Example
```
$(document).ready(function()
{
	$(document).imagePreview({
		elements : ['a.preview'],
		hoverDelay : 175,
		windowMargin : 8,
		css : {
			'-webkit-box-shadow' : '0px 0px 3px 0px rgba(0,0,0,0.35)',
			'-moz-box-shadow' : '0px 0px 3px 0px rgba(0,0,0,0.35)',
			'box-shadow' : '0px 0px 3px 0px rgba(0,0,0,0.35)',
			'border-radius' : '3px'
		},
		extensions : {
			images : ['jpg', 'jpeg', 'gif', 'png'],
			videos : ['mp4', 'webm']
		}
	});
});
```
#### Overview

Key | Default | Description
----|---------|------------
`elements` | | The elements that should have a hoverable preview.
`hoverDelay` | 150 | Delay in milliseconds before the preview is shown.
`staticPreview` | true | Whether the preview should be static `true` or follow the cursor `false`.
`css` | | Custom CSS rules that will be applied to the image or video.
`windowMargin` | 4 | Margin between the preview and the window borders.
`triggerMargin` | 24 | Margin between the the preview and the cursor or the element which triggered it.
`extensions` | All | What extensions should have a hoverable preview (See above for an example).
