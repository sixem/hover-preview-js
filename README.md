hover-preview-js
A simple plugin that adds hoverable image and video previews to any element.

* No dependencies.
* Browser, ES6 and CommonJS support.

A demo of the script can be found [here](https://five.sh/demo/hover-preview/).

## Usage

### Install via npm
`npm install hover-preview-js`

### Include the script
Download and include the script in your web page.
```
// CommonJS
const preview = require('hover-preview-js');

// ES6
import preview from 'hover-preview-js';

// if importing it as a <script>
const preview = window.hoverPreview;
```
### Usage
```
var p = preview(document.querySelector('div.preview'),
{
	delay : 100
});
```

## License

MIT License

Copyright (c) 2020 ему (sixem)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.