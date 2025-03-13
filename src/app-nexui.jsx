import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Router } from 'preact-router';
import { signal, effect, computed } from '@preact/signals';
import TGA from './lib/tga.js';


const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 2048;

const FONT_SIZE = 38.78; // Match this so that tabular figures have 25px width, e.g. fit three numbers within PANEL_WIDTH
const FONT_FAMILY = 'Inter';
const FONT_BASELINE = 0.8;

const PANEL_WIDTH = 75; // 2048/81 * 3;
const PANEL_HEIGHT = 48;

const COLUMNS = Math.floor(TEXTURE_WIDTH / PANEL_WIDTH);
const ROWS = Math.floor(TEXTURE_HEIGHT / PANEL_HEIGHT);

function indexToCoords(index) {
	let x = Math.floor(index % COLUMNS) * PANEL_WIDTH;
	let y = Math.floor(index / COLUMNS) * PANEL_HEIGHT;
	let origin = x + PANEL_WIDTH;
	let baseline = y + PANEL_HEIGHT * FONT_BASELINE;
	return { x, y, origin, baseline };
}


function NumberTexture() {
	const root = useRef(null);
	
	useEffect(() => {
		let dPR = 1.0; // 2.0;
		root.current.width = TEXTURE_WIDTH * dPR;
		root.current.height = TEXTURE_HEIGHT * dPR;
		root.current.style.aspectRatio = `${TEXTURE_WIDTH} / ${TEXTURE_HEIGHT}`;
		const ctx = root.current.getContext('2d', { willReadFrequently: true });
		ctx.scale(dPR, dPR);
		
		root.current.style.fontVariantNumeric = 'tabular-nums';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'right';
		ctx.font = `400 ${FONT_SIZE}px ${FONT_FAMILY}, sans-serif`
		ctx.textBaseline = 'baseline';
		
		// console.log(FONT_SIZE, ctx.measureText('1').width);
		
		let iterator = 0;
		for(let row = 0; row < ROWS; ++row)
		{
			for(let column = 0; column < COLUMNS; ++column)
			{
				let { x, y, origin, baseline } = indexToCoords(iterator);
				
				ctx.save();
				
				// ctx.beginPath();
				// ctx.rect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
				// ctx.clip();
				
				// ctx.fillStyle = iterator % 2? 'white' : 'black';
				
				if(iterator < 10) ctx.fillText(iterator, origin, baseline);
				else if(iterator > 10 && iterator < 1001) ctx.fillText(iterator - 1, origin, baseline);
				else if(iterator >= 1001 && iterator < 1101) ctx.fillText((iterator - 1001).toString().padStart(3, '0'), origin, baseline);
				
				// ctx.fillStyle = iterator % 2? 'hsla(0 0% 100% / 0.2)' : 'hsla(0 0% 0% / 0.2)';
				// ctx.fillRect(x, y, PANEL_WIDTH, PANEL_HEIGHT);
				
				ctx.restore();
				if(iterator >= 1101) break;
				iterator++;
			}
		}
		
		let { x, y, origin, baseline } = indexToCoords(iterator);
		
		// Next row
		x = 0;
		y = (Math.floor(iterator / COLUMNS) + 1) * PANEL_HEIGHT;
		baseline = y + PANEL_HEIGHT * FONT_BASELINE;
		
		// Draw minus, we slide this around, so we need some whitespace around it
		ctx.fillRect(x += 1, y, 1, PANEL_HEIGHT);
		x += PANEL_WIDTH * 3 + 11*2; // Whitespace
		ctx.fillText('-', x += 25, baseline); // Minus
		x += PANEL_WIDTH * 3 + 11*2; // Whitespace
		ctx.fillRect(x += 1, y, 1, PANEL_HEIGHT);
		
		// Next row
		// x = 0;
		// y = (Math.floor(iterator / COLUMNS) + 1) * PANEL_HEIGHT;
		// baseline = y + PANEL_HEIGHT * FONT_BASELINE;
		
		ctx.textAlign = 'center';
		x -= 12.5;
		
		// Draw separators we can use
		ctx.fillText(',', x += 25, baseline);
		// ctx.strokeRect(x - 12.5 - 0.5, y - 0.5, 25 + 1, 48 + 1);
		ctx.fillText('.', x += 25, baseline);
		// ctx.strokeRect(x - 12.5 - 0.5, y - 0.5, 25 + 1, 48 + 1);
		
		ctx.fillText('<', x += 25, baseline);
		// ctx.strokeRect(x - 12.5 - 0.5, y - 0.5, 25 + 1, 48 + 1);
		
	}, []);
	
	
	
	
	const downloadCallback = useCallback(() => {
		const filename = `Number Texture`;
		
		let script = `
#define TEXTURE_WIDTH ${TEXTURE_WIDTH}.
#define FONT_SIZE ${FONT_SIZE}
#define FONT_FAMILY ${FONT_FAMILY}
#define FONT_BASELINE ${FONT_BASELINE}
#define PANEL_WIDTH ${PANEL_WIDTH}.
#define PANEL_HEIGHT ${PANEL_HEIGHT}.
#define COLUMNS ${COLUMNS}
#define ROWS ${ROWS}
`;
		var downloadAnchor = document.createElement('a');
		downloadAnchor.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(script);
		downloadAnchor.setAttribute('download', `NexUI4 Numbers.lsl`);
		downloadAnchor.click();
		
		
		let ctx = root.current.getContext('2d');
		let imageData = ctx.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
		
		for(let iterator = 0; iterator < imageData.data.length; iterator += 4)
		{
			imageData.data[iterator + 0] = 255;
			imageData.data[iterator + 1] = 255;
			imageData.data[iterator + 2] = 255;
		}
		
		
		
		// for(let [rx, ry, rw, rh] of UncoloredRects)
		// {
		// 	let cx = rx - 4, cy = ry - 4;
		// 	let cw = rw + 6, ch = rh + 6;
		// 	for(let x = cx; x < cx+cw; ++x)
		// 	{
		// 		for(let y = cy; y < cy+ch; ++y)
		// 		{
		// 			if(rx <= x && x < rx+rw && ry <= y && y < ry+rh) continue;
		// 			let index = (x + y * imageData.width) * 4;
		// 			imageData.data[index + 0] = 255;
		// 			imageData.data[index + 1] = 255;
		// 			imageData.data[index + 2] = 255;
		// 		}
		// 	}
		// }
		
		// for(let char of Characters)
		// {
		// 	let metrics = data[char];
		// }
		
		// Brute force set pixels to pure white color to avoid linear scaling to black transparent pixels
		// for(let [rx, ry, rw, rh] of UncoloredRects)
		// {
		// 	for(let i = 0; i < imageData.data.length; i += 4)
		// 	{
		// 		let x = (p/4) % TEXTURE_WIDTH;
		// 		let y = Math.floor((p/4) / TEXTURE_WIDTH);
		// 		if(x >= rx && x <= rx+rw && y >= ry && y <= ry+rh)
		// 		{
		// 			imageData.data[i + 0] = 255;
		// 			imageData.data[i + 1] = 255;
		// 			imageData.data[i + 2] = 255;
		// 		}
		// 	}
		// }
		
		ctx.putImageData(imageData, 0, 0);
		
		let tga = new TGA({
			width: TEXTURE_WIDTH,
			height: TEXTURE_HEIGHT,
			imageType: TGA.Type.RLE_RGB,
		});
		
		tga.setImageData(imageData);
		
		var downloadAnchor = document.createElement('a');
		downloadAnchor.href = tga.getBlobURL();
		downloadAnchor.setAttribute('download', `${filename}.tga`);
		downloadAnchor.click();
	}, []);
	
	return <canvas class="texture" ref={root} onClick={downloadCallback}/>;
}




const fontLoaded = signal(false);

export function App() {
	useEffect(() => {
		Promise.all([
			document.fonts.load(`400 16px Inter, sans-serif`),
		]).then(() => {
			fontLoaded.value = true;
		});
	}, []);
	
	if(!fontLoaded.value) return null;
	
	return (
		<>
			<NumberTexture/>
		</>
	)
}