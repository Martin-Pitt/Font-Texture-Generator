import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Router } from 'preact-router';
import { signal, effect, computed } from '@preact/signals';
import state from './state.js';


function glyphsFromCodePointRange(start, end) {
	let list = [];
	for(let index = start; index <= end; ++index) list.push(String.fromCodePoint((index)));
	return list;
}

// Printable Latin Characters, with [0-9a-zA-Z] priority order
let glyphs = [
	[48, 57], // [0-9]
	[97, 122], // [a-z]
	[65, 90], // [A-Z]
	[33, 47], [58, 64], [91, 95], [123, 126], [161, 172], [174, 191], // Punctuation & Symbols
	
	// [192, 400],
	// [0x100, 0x17F], // Latin Extended-A
	// [0x180, 0x24F], // Latin Extended-B
	// [0x250, 0x2AF], // IPA Extensions
	// [0x2B0, 0x2FF], // Spacing Modifier Letters
	// [0x300, 0x36F], // Combining Diacritical Marks
	// [0x370, 0x3FF], // Greek and Coptic
	// [0x400, 0x4FF], // Cyrillic
	// [0x500, 0x52F], // Cyrillic Supplement
	
	// [0x2000, 0x206F], // General Punctuation
	// [0x2070, 0x209F], // Superscripts and Subscripts
	// [0x20A0, 0x20CF], // Currency Symbols
	// [0x2100, 0x214F], // Letterlike Symbols
	// [0x2150, 0x218F], // Number Forms
	// [0x2190, 0x21FF], // Arrows
	// [0x2200, 0x22FF], // Math Ops
	// [0x2300, 0x23FF], // Misc Tech
	// [0x2500, 0x257F], // Box Drawing
	// [0x2580, 0x259F], // Block Elements
	// [0x25A0, 0x25FF], // Geometric Shapes
	// [0x2600, 0x26FF], // Misc Symbols
	// [0x, 0x], // ?
].flatMap(range => glyphsFromCodePointRange(...range));

/*
vector Glyphs(string Glyph) {
    if(Glyph == "?") return <glyphX, glyphY, textureIndex.glyphWidth>;
	return <0,0,0>;
*/

let glyphData = {};

const TEXTURE_SIZE = 2048;
const TEXTURE_WIDTH = TEXTURE_SIZE;
const TEXTURE_HEIGHT = TEXTURE_SIZE;
const FONT_SIZE = 50;
const CELL_SIZE = 64;
const ROWS = TEXTURE_SIZE / CELL_SIZE;
let whitespace;
let widestWidth = 0;
let columns = 0;
let columnWidth = 0;


function FontTexture() {
	const root = useRef(null);
	
	useEffect(() => {
		// let dPR = window.devicePixelRatio;
		root.current.width = TEXTURE_WIDTH;
		root.current.height = TEXTURE_HEIGHT;
		root.current.style.aspectRatio = `${TEXTURE_WIDTH} / ${TEXTURE_HEIGHT}`;
		const ctx = root.current.getContext('2d', { willReadFrequently: true });
		
		// Font settings
		ctx.fillStyle = 'lch(100 0 0)';
		ctx.font = `400 ${FONT_SIZE}px Inter, sans-serif`;
		ctx.textBaseline = 'baseline';
		whitespace = {
			' ': ctx.measureText(' ').width, // Space
			' ': ctx.measureText(' ').width, // EN Space
			' ': ctx.measureText(' ').width, // EM Space
			' ': ctx.measureText(' ').width, // Three-per-EM Space
			' ': ctx.measureText(' ').width, // Four-per-EM Space
			' ': ctx.measureText(' ').width, // Six-per-EM Space
			' ': ctx.measureText(' ').width, // Figure Space
			' ': ctx.measureText(' ').width, // Punctuation Space
			' ': ctx.measureText(' ').width, // Thin Space
			' ': ctx.measureText(' ').width, // Hair Space
		};
		
		// Measure each glyph
		widestWidth = 0;
		for(let char of glyphs)
		{
			if(!char) continue;
			let metrics = ctx.measureText(char);
			glyphData[char] = [0, 0, metrics.width];
			console.assert(glyphData[char][2] < CELL_SIZE, 'Glyph out of bounds error', char, glyphData[char][2]);
			if(metrics.width > widestWidth) widestWidth = metrics.width;
		}
		
		columnWidth = widestWidth * 8;
		columns = Math.floor(TEXTURE_WIDTH / columnWidth);
		columnWidth = TEXTURE_WIDTH / columns;
		
		
		/*
		// Debug overlays
		for(let b = 0; b < ROWS; ++b)
		{
			let y = CELL_SIZE * b;
			ctx.strokeStyle = 'green';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(TEXTURE_SIZE, y);
			ctx.stroke();
		}
		
		for(let a = 0; a < columns; ++a)
		{
			let x = columnWidth * 0.5 + columnWidth * a;
			
			// ctx.strokeStyle = 'red';
			// ctx.lineWidth = 2;
			// ctx.beginPath();
			// ctx.moveTo(x, 0);
			// ctx.lineTo(x, TEXTURE_SIZE);
			// ctx.moveTo(x + CELL_SIZE, 0);
			// ctx.lineTo(x + CELL_SIZE, TEXTURE_SIZE);
			// ctx.stroke();
			
			for(let b = 0; b < ROWS; ++b)
			{
				let y = CELL_SIZE * b;
				
				let index = b + a * ROWS;
				let char = glyphs[index];
				if(!char) continue;
				
				ctx.strokeStyle = 'lch(50 100 30)';
				ctx.lineWidth = 1;
				ctx.beginPath();
				// ctx.rect(x + 0.5, y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
				ctx.rect(x + 0.5, y + 0.5, Math.ceil(glyphData[char][2]), CELL_SIZE - 1);
				// ctx.moveTo(x + CELL_SIZE, y + CELL_SIZE/2);
				// ctx.lineTo(x + columnWidth, y + CELL_SIZE/2);
				ctx.stroke();
			}
		}
		*/
		
		/*
		// Draw baseline
		for(let b = 0; b < ROWS; ++b)
		{
			let y = CELL_SIZE * b;
			ctx.strokeStyle = 'green';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(0, y + CELL_SIZE * 0.75);
			ctx.lineTo(TEXTURE_SIZE, y + CELL_SIZE * 0.75);
			ctx.stroke();
		}
		*/
		
		
		// Render them in a grid
		for(let a = 0; a < columns; ++a)
		{
			let x = columnWidth * 0.5 + columnWidth * a;
			for(let b = 0; b < ROWS; ++b)
			{
				let y = CELL_SIZE * b;
				let index = b + a * ROWS;
				let char = glyphs[index];
				if(!char) continue;
				
				ctx.save();
				// ctx.beginPath();
				// ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
				// ctx.clip();
				ctx.globalCompositeOperation = 'lighter';
				ctx.fillStyle = 'lch(100 0 0 / 5.6%)';
				for(let w = 100; w <= 900; w += 50)
				{
					ctx.font = `${w} ${FONT_SIZE}px Inter, sans-serif`;
					ctx.fillText(char, x, y + CELL_SIZE * 0.75);
				}
				ctx.restore();
				
				// ctx.fillStyle = 'lch(70 100 0 / 70%)';
				// ctx.fillText(char + char + char + char, x + 100, y + CELL_SIZE * 0.75);
				
				// ctx.fillStyle = 'lch(70 100 215 / 70%)';
				// ctx.fillText(char, x + 100, y + CELL_SIZE * 0.75);
				// ctx.fillText(char, x + 100 + metrics.width, y + CELL_SIZE * 0.75);
				// ctx.fillText(char, x + 100 + metrics.width*2, y + CELL_SIZE * 0.75);
				// ctx.fillText(char, x + 100 + metrics.width*3, y + CELL_SIZE * 0.75);
				
				// let tx = (-0.5 + 1/8) + (1/4) * a;
				// let ty = (-0.5 + 1/64) + (1/32) * b;
				
				// let tx = -(0.5 - (1 / columns) * a);// + (1 / CELL_SIZE); // Need to dynamically: 1/(64-48+64)
				// let ty = 0.5 - (1 / ROWS) * b - (1 / CELL_SIZE);
				
				let cx = (x + glyphData[char][2]/2) - TEXTURE_WIDTH/2;
				let cy = (y + CELL_SIZE/2) - TEXTURE_HEIGHT/2;
				glyphData[char][0] = cx;
				glyphData[char][1] = cy;
			}
		}
		
		
		/*
		// Check alpha channel range
		let min = 255, max = 0;
		let imageData = ctx.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
		for(let i = 0; i < imageData.data.length; i += 4)
		{
			let alpha = imageData.data[i + 3];
			if(alpha === 0.0) continue;
			min = Math.min(alpha, min);
			max = Math.max(alpha, max);
		}
		*/
		
		
		/*
		let debug = {
			columnWidth,
			columns,
			widestWidth,
			whitespace,
			min, max,
			glyphData
		};
		object.assign(window, debug);
		console.log(debug);
		*/
		
		console.log({
			whitespace
		});
		
	}, []);
	
	
	
	const downloadCallback = useCallback(() => {
		const filename = 'Font_Inter_1';
		
		
		let script = `
#define TEXTURE_INTER "Replace with UUID of uploaded ${filename} texture"
#define TEXTURE_EIGHT "876a12ca-928e-baf1-a35b-f3aab5db95bc"
#define TEXTURE_SIZE ${TEXTURE_SIZE}.
#define CELL_SIZE ${CELL_SIZE}.
#define WIDEST_WIDTH ${widestWidth}
#define COLUMNS ${columns}
#define COLUMN_WIDTH ${columnWidth}


vector Glyphs(string Glyph) {
${glyphs.map(glyph => {
	let data = glyphData[glyph];
	if(glyph == '"') glyph = '\\"';
	else if(glyph == '\\') glyph = '\\\\';
	return `\tif(Glyph == "${glyph}") return <${data[0]}, ${data[1]}, ${data[2]}>;`
}).join('\n')}
	return <0, 0, 0>;
}


// Resource management
list Free;
list Used;
list Params;
integer facesLeft;
vector offset;
integer linkTarget;
list queue;

// Positioning
vector Anchor;
// rotation Direction;

// Styling
vector FontColour = <1,1,1>;
float FontSize = 0.64;
float LineHeight = 1.2;
integer MaskCutoff = 127;

// Overflow
float TextClipLength = 64.0;
float TextWrapLength = 64.0;


// Initializes the system by checking for Text prims and resetting them
textInit()
{
	integer Prims = llGetNumberOfPrims() + 1;
	while(--Prims)
		if(llGetLinkName(Prims) == "Text")
		{
			Free += Prims;
			Params += [
				PRIM_LINK_TARGET, Prims,
				PRIM_POS_LOCAL, <0,0,0>,
				PRIM_ROT_LOCAL, <0.5,0.5,0.5,0.5>,
				PRIM_SIZE, <.01,.01,.01>,
				PRIM_COLOR, ALL_SIDES, FontColour, 0,
				PRIM_ALPHA_MODE, ALL_SIDES, PRIM_ALPHA_MODE_MASK, MaskCutoff
			];
			if(!(Prims%32)) textRender();
		}
	textRender();
}

// Depending how much you draw, make sure to flush the render so you don't stack heap
textRender()
{
	llSetLinkPrimitiveParamsFast(0, Params);
	Params = [];
	facesLeft = 0;
}


textOrigin(vector newAnchor)
{
	facesLeft = 0;
	offset = <0,0,0>;
}

textFontWeight(integer weight)
{
	MaskCutoff = llRound(22. + ((64. - 220.) * ((100. - weight) / (100. - 900.))));
}

// Main function, draw some text!
text(string str)
{
	list renders = [/*integer linkTarget, integer faces, vector offset<textWidth, y, z>*/];
	list glyphs = [/*vector glyph*/];
	integer index; integer total;
	for(total = llStringLength(str); index < total; ++index)
	{
		string letter = llGetSubString(str, index, index);
		if(letter == "\n")
		{
			facesLeft = 0;
			offset.y = 0;
			offset.z -= FontSize * LineHeight;
			// tOrigin(Anchor - <0,0,FontSize * LineHeight>);
		}
		else if(letter == " ") offset.x += 12.5;
		else
		{
			vector glyph = Glyphs(letter);
			if((offset.x/CELL_SIZE) * FontSize > TextClipLength); // consume clipped text
			else
			{
				if(!facesLeft || (offset.x + glyph.z >= COLUMN_WIDTH))
				{
					// Consume prim
					integer linkTarget = llList2Integer(Free, 0);
					Free = llDeleteSubList(Free, 0, 0);
					Used += linkTarget;
					if(renders) renders += [8, offset];
					renders += [linkTarget];
					facesLeft = 8;
					offset = <0,0,0>;
				}
				
				glyphs += <glyph.x - glyph.z/2, glyph.y, offset.x>;
				offset.x += glyph.z;
				facesLeft--;
				
				if((offset.x/CELL_SIZE) * FontSize > TextWrapLength)
				{
					facesLeft = 0;
					offset.y = 0;
					offset.z -= FontSize * LineHeight;
					// tOrigin(Anchor - <0,0,FontSize * LineHeight>);
				}
			}
		}
	}
	
	list data;
	
	if(renders)
	{
		renders += [facesLeft, offset];
		facesLeft = 0;
		offset = <0,0,0>;
		data += [Anchor.x, Anchor.y, Anchor.z];
	}
	
	while(renders)
	{
		integer linkTarget = llList2Integer(renders, 0);
		integer faces = llList2Integer(renders, 1);
		vector off = llList2Vector(renders, 2);
		
		Params += [PRIM_LINK_TARGET, linkTarget];
		
		vector repeats = <off.x / TEXTURE_SIZE, CELL_SIZE / TEXTURE_SIZE, 0>;
		for(index = 0; total = faces; index < total; ++index)
		{
			vector glyph = llList2Vector(glyphs, index);
			Params += [
				PRIM_TEXTURE, index, TEXTURE_INTER, repeats,
				<(glyph.x - glyph.z + off.x/2) / TEXTURE_SIZE, glyph.y / -TEXTURE_SIZE, 0>, 0.0
			];
		}
		
		renders = llDeleteSubList(renders, 0, 2);
		glyphs = llDeleteSubList(glyphs, 0, faces - 1);
		
		Params += [PRIM_SIZE, <(off.x/CELL_SIZE) * FontSize, FontSize, 0.01>];
		
		data += [linkTarget, offset.y, offset.z];
	}
	
	
	textRender();
	
	return data;
}
`;
		// console.log(lsl);
		
		var downloadAnchor = document.createElement('a');
		downloadAnchor.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(script);
		downloadAnchor.setAttribute('download', `NexText4.lsl`);
		downloadAnchor.click();
		
		
		
		let ctx = root.current.getContext('2d');
		let imageData = ctx.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
		for(let i = 0; i < imageData.data.length; i += 4)
		{
			if(
				(imageData.data[i + 0] > 64 || imageData.data[i + 1] > 64) &&
				imageData.data[i + 2] < 64
			) continue;
			
			imageData.data[i + 0] = 255;
			imageData.data[i + 1] = 255;
			imageData.data[i + 2] = 255;
		}
		ctx.putImageData(imageData, 0, 0);
		
		root.current.toBlob(blob => {
			var url = URL.createObjectURL(blob);
			
			// var downloadAnchor = document.createElement('a');
			downloadAnchor.href = url;
			downloadAnchor.setAttribute('download', `${filename}.png`);
			downloadAnchor.click();
		}, 'image/png', 1);
	}, []);
	
	return <canvas class="texture" ref={root} onClick={downloadCallback}/>;
}


const fontLoaded = signal(false);

export function App() {
	useEffect(() => {
		document.fonts.load(`400 ${FONT_SIZE}px Inter, sans-serif`).then(() => {
			fontLoaded.value = true;
		});
		
		// let font = new FontFace('Inter', `url('../fonts/Inter-VariableFont_opsz,wght.ttf')`)
		// font.load().ready.then(() => {
		// 	fontLoaded.value = true;
		// });
	}, []);
	
	if(!fontLoaded.value) return null;
	
	return (
		<>
			<FontTexture/>
		</>
	)
}