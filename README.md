# image.preview.js
This plugin will display a preview of whatever image or video link is being hovered over.

## Requirements
### [jQuery](https://jquery.com/download/)

## Usage
To use this plugin you need to add the `preview` class to any link or element you want to have display a preview. If you are using a simple `a` element then all you have to do is add the class and the plugin will fetch the URL automatically.

If you want to display a preview using something other than a regular link then you can use the `data-preview` attribute instead.

### Examples

`<a class="preview" href="https://eyy.co/files/9158.jpg">Image</a>`

`<div class="preview" style="display:inline-block;" data-preview="https://eyy.co/files/9158.jpg">Image</div>`

The reason `inline-block` is being used for the `div` element is because the preview will be placed next to whatever element triggered it so a `div` element that is covering the entire page will not work with this plugin.