'use strict';

import {
	loadImage,
	loadVideo,
	createContainer,
	getType
} from './utils';

function setOffset(e)
{
	this.data.offset = {
		x : e.clientX,
		y : e.clientY
	};
}

function onEnter(e)
{
	var target = e.target;

	// get source
	if(target.hasAttribute('data-src'))
	{
		this.data.src = target.getAttribute('data-src');
	} else if(target.hasAttribute('src'))
	{
		this.data.src = target.getAttribute('src');
	} else if(target.hasAttribute('href'))
	{
		this.data.src = target.getAttribute('href');
	}

	if(this.data.src === null)
	{
		throw Error('No valid source value found.');
	}

	// get source type
	this.data.type = getType.call(this);

	// if valid source type
	if(this.data.type != null)
	{
		var _this = this;

		// whether the cursor is on the left or ride side of the viewport
		this.data.left = this.data.offset.x <= (window.innerWidth / 2);

		// create preview container
		var container = document.body.appendChild(createContainer());

		// handle image type
		if(this.data.type === 0 || this.data.type === 1)
		{
			// wait for media to show its dimensions
			(this.data.type === 0 ? loadImage : loadVideo)
			.call(this, this.data.src, function(e, dimensions)
			{
				container.appendChild(e);

				_this.data.container = container;
				_this.data.dimensions = {
					x : dimensions[0],
					y : dimensions[1]
				};

				_this.loaded = true;

				update.call(_this);

				container.style['visibility'] = 'visible';
			});
		}
	}
}

function update()
{
	this.updater(
		this.data.left,
		this.data.container, {
		dimensions : this.data.dimensions,
		offset : {
			x : this.data.offset.x,
			y : this.data.offset.y
		}
	});
}

export function mousemove(e)
{
	setOffset.call(this, e);

	if(!this.loaded)
	{
		return false;
	}

	update.call(this);
}

export function mouseenter(e)
{
	setOffset.call(this, e);

	var _this = this;

	this.options.delay = setTimeout(function()
	{
		onEnter.call(_this, e);
	}, this.options.delay);
}

// destroy preview container
export function mouseleave()
{
	clearTimeout(this.options.delay);

	var container = document.querySelector('.preview-container');

	if(container)
	{
		container.remove();
	}

	clearInterval(this.data.wait);

	this.loaded = false;
}