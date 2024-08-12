import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Router } from 'preact-router';
import state from './state.js';
// import TinySDF from '@mapbox/tiny-sdf';

// const tinySDF = new TinySDF({
// 	fontSize: 50,
// 	fontFamily: 'Inter',
// 	fontWeight: 'normal',
// 	fontStyle: 'normal',
// 	buffer: 10, // Math.ceil(50 / 8),
// 	radius: 16, // Math.ceil(50 / 4),
// 	cutoff: 0.25
// });


function glyphsFromCodePointRange(start, end) {
	let list = [];
	for(let index = start; index <= end; ++index) list.push(String.fromCodePoint((index)));
	return list;
}

let glyphs = [
	// [33, 47],
	// [48, 57], // [0-9]
	// [58, 64],
	// [65, 90], // [A-Z]
	// [91, 95],
	// [97, 122], // [a-z]
	// [123, 126],
	[161, 172],
	[174, 255],
].flatMap(range => glyphsFromCodePointRange(...range));





// let glyphs = [
// 	'e','t','a','o','i','n','s','r','h','l','d','c','u','m','f','p','g','w','y','b',',','.','v','k','(',')','_',';','"','=','\'','-','x','/',
// 	'0','$','*','1','j',':','{','}','>','q','[',']','2','z','!','<','?','3','+','5','\\','4','#','@','|','6','&','9','8','7',
// 	'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
// 	'%','^','~','`'
// ];

/*
vector Glyphs(string Glyph) {
    if(Glyph == "e") return <-.25, 0.093750, 2.581686>;
    if(Glyph == "t") return <0.25, 0.156250, 2.418314>;
    if(Glyph == "a") return <-.25, 0.343750, 2.543184>;
    if(Glyph == "o") return <0.25, 0.468750, 2.613944>;
    if(Glyph == "i") return <-.25, -0.156250, 2.263268>;
    if(Glyph == "n") return <-.25, -0.468750, 2.597295>;
    if(Glyph == "s") return <0.25, 0.218750, 2.464100>;
    if(Glyph == "r") return <0.25, 0.281250, 2.401665>;
    if(Glyph == "h") return <-.25, -0.093750, 2.594173>;
    if(Glyph == "l") return <-.25, -0.343750, 2.284079>;
    if(Glyph == "d") return <-.25, 0.156250, 2.612903>;
    if(Glyph == "c") return <-.25, 0.218750, 2.483871>;
    if(Glyph == "u") return <0.25, 0.093750, 2.597295>;
    if(Glyph == "m") return <-.25, -0.406250, 2.895942>;
    if(Glyph == "f") return <-.25, 0.031250, 2.401665>;
    if(Glyph == "p") return <0.25, 0.406250, 2.612903>;
    if(Glyph == "g") return <-.25, -0.031250, 2.601457>;
    if(Glyph == "w") return <0.25, -0.031250, 2.808533>;
    if(Glyph == "y") return <0.25, -0.156250, 2.517169>;
    if(Glyph == "b") return <-.25, 0.281250, 2.612903>;
    if(Glyph == ",") return <-.25, -0.343750, 0.255983>;
    if(Glyph == ".") return <-.25, -0.468750, 0.255983>;
    if(Glyph == "v") return <0.25, 0.031250, 2.522372>;
    if(Glyph == "k") return <-.25, -0.281250, 2.543184>;
    if(Glyph == "(") return <-.25, -0.093750, 0.337149>;
    if(Glyph == ")") return <-.25, -0.156250, 0.337149>;
    if(Glyph == "_") return <-.25, 0.468750, 2.511967>;
    if(Glyph == ";") return <0.25, -0.281250, 0.255983>;
    if(Glyph == "\"") return <-.25, 0.406250, 0.434964>;
    if(Glyph == "=") return <0.25, -0.406250, 0.586889>;
    if(Glyph == "'") return <-.25, -0.031250, 0.250780>;
    if(Glyph == "-") return <-.25, -0.406250, 0.311134>;
    if(Glyph == "x") return <0.25, -0.093750, 2.531738>;
    if(Glyph == "/") return <0.25, 0.468750, 0.399584>;
    if(Glyph == "0") return <0.25, 0.406250, 0.586889>;
    if(Glyph == "$") return <-.25, 0.281250, 0.586889>;
    if(Glyph == "£") return <-.25, 0.218750, 0.586889>;
    if(Glyph == "€") return <-.25, 0.156250, 0.586889>;
    if(Glyph == "*") return <-.25, -0.218750, 0.499480>;
    if(Glyph == "1") return <0.25, 0.343750, 0.586889>;
    if(Glyph == "j") return <-.25, -0.218750, 2.263268>;
    if(Glyph == ":") return <0.25, -0.218750, 0.255983>;
    if(Glyph == "{") return <0.25, -0.281250, 2.346514>;
    if(Glyph == "}") return <0.25, -0.406250, 2.346514>;
    if(Glyph == ">") return <0.25, -0.468750, 0.586889>;
    if(Glyph == "q") return <0.25, 0.343750, 2.612903>;
    if(Glyph == "[") return <0.25, -0.281250, 1.342352>;
    if(Glyph == "]") return <0.25, -0.406250, 1.342352>;
    if(Glyph == "2") return <0.25, 0.281250, 0.586889>;
    if(Glyph == "z") return <0.25, -0.218750, 2.490114>;
    if(Glyph == "!") return <-.25, 0.468750, 0.287201>;
    if(Glyph == "<") return <0.25, -0.343750, 0.586889>;
    if(Glyph == "?") return <-.25, 0.468750, 1.420395>;
    if(Glyph == "3") return <0.25, 0.218750, 0.586889>;
    if(Glyph == "+") return <-.25, -0.281250, 0.586889>;
    if(Glyph == "5") return <0.25, 0.093750, 0.586889>;
    if(Glyph == "\\") return <0.25, -0.343750, 1.399584>;
    if(Glyph == "4") return <0.25, 0.156250, 0.586889>;
    if(Glyph == "#") return <-.25, 0.343750, 0.694069>;
    if(Glyph == "@") return <-.25, 0.406250, 1.988554>;
    if(Glyph == "|") return <0.25, -0.343750, 2.290323>;
    if(Glyph == "6") return <0.25, 0.031250, 0.586889>;
    if(Glyph == "9") return <0.25, -0.156250, 0.586889>;
    if(Glyph == "8") return <0.25, -0.093750, 0.586889>;
    if(Glyph == "7") return <0.25, -0.031250, 0.586889>;
    if(Glyph == "A") return <-.25, 0.343750, 1.689906>;
    if(Glyph == "B") return <-.25, 0.281250, 1.669095>;
    if(Glyph == "C") return <-.25, 0.218750, 1.645161>;
    if(Glyph == "D") return <-.25, 0.156250, 1.741935>;
    if(Glyph == "E") return <-.25, 0.093750, 1.594173>;
    if(Glyph == "F") return <-.25, 0.031250, 1.558793>;
    if(Glyph == "G") return <-.25, -0.031250, 1.699272>;
    if(Glyph == "H") return <-.25, -0.093750, 1.733611>;
    if(Glyph == "I") return <-.25, -0.156250, 1.279917>;
    if(Glyph == "J") return <-.25, -0.218750, 1.520291>;
    if(Glyph == "K") return <-.25, -0.281250, 1.654526>;
    if(Glyph == "L") return <-.25, -0.343750, 1.540062>;
    if(Glyph == "M") return <-.25, -0.406250, 1.906348>;
    if(Glyph == "N") return <-.25, -0.468750, 1.757544>;
    if(Glyph == "O") return <0.25, 0.468750, 1.809573>;
    if(Glyph == "P") return <0.25, 0.406250, 1.632674>;
    if(Glyph == "Q") return <0.25, 0.343750, 1.809573>;
    if(Glyph == "R") return <0.25, 0.281250, 1.654526>;
    if(Glyph == "S") return <0.25, 0.218750, 1.553590>;
    if(Glyph == "T") return <0.25, 0.156250, 1.587929>;
    if(Glyph == "U") return <0.25, 0.093750, 1.715921>;
    if(Glyph == "V") return <0.25, 0.031250, 1.682622>;
    if(Glyph == "W") return <0.25, -0.031250, 1.966701>;
    if(Glyph == "X") return <0.25, -0.093750, 1.656608>;
    if(Glyph == "Y") return <0.25, -0.156250, 1.622268>;
    if(Glyph == "Z") return <0.25, -0.218750, 1.596254>;
    if(Glyph == "&") return <-.25, 0.031250, 0.693028>;
    if(Glyph == "%") return <-.25, 0.093750, 0.892820>;
    if(Glyph == "^") return <0.25, -0.468750, 1.586889>;
    if(Glyph == "~") return <0.25, -0.468750, 2.586889>;
    if(Glyph == "`") return <-.25, 0.406250, 2.391259>;
    
    / * Ordered according to QWERTY keyboard letter frequency:
        e t a o i n s r h l d c u m f p g w y b , . v k ( ) _ ; " = ' - x /
        0 $ * 1 j : { } > q [ ] 2 z ! < ? 3 + 5 \ 4 # @ | 6 & 9 8 7 % ^ ~ `
        Wasn't sure where to put upper case, so just put them where it made sense.
    * /
    return <0, 0, 0>;
}
*/

let glyphData = {};

function FontTexture() {
	const root = useRef(null);
	
	useEffect(() => {
		let dPR = window.devicePixelRatio;
		let width = 2048;
		let height = 2048;
		root.current.width = width;
		root.current.height = height;
		root.current.style.aspectRatio = `${width} / ${height}`;
		const ctx = root.current.getContext('2d', { willReadFrequently: true });
		// ctx.translate(0.5, 0.5);
		// ctx.scale(dPR, dPR);
		
		/*
		for(let w = 100; w <= 1000; w += 50)
		{
			ctx.fillStyle = 'lch(100 0 0 / 10%';
			ctx.font = `${w} 50px Inter, sans-serif`;
			ctx.textBaseline = 'middle';
			
			for(let a = 0; a < 2; ++a)
			{
				for(let b = 0; b < 16; ++b)
				{
					let index = b + a * 16;
					// let char = String.fromCodePoint(65 + index);
					let char = String.fromCodePoint(63 + index);
					let measure = ctx.measureText(char);
					let x = 10 + 512 * a;
					let y = 32 + 64 * b;
					ctx.fillText(char, x, y);
					
					// ctx.strokeStyle = 'red';
					// ctx.beginPath();
					// ctx.moveTo(x, y - measure.fontBoundingBoxAscent);
					// ctx.lineTo(x + 30, y - measure.fontBoundingBoxAscent);
					// ctx.stroke();
					// ctx.beginPath();
					// ctx.strokeStyle = 'green';
					// ctx.moveTo(x, y + measure.fontBoundingBoxDescent);
					// ctx.lineTo(x + 30, y + measure.fontBoundingBoxDescent);
					// ctx.stroke();
				}
			}
		}
		*/
		
		
		for(let a = 0; a < 4; ++a)
		{
			let x = 0 + 512 * a;
			for(let b = 0; b < 32; ++b)
			{
				let y = 64 * b;
				let index = b + a * 32;
				// let char = String.fromCodePoint(63 + index);
				
				// let codepoint = 33 + index;
				// if(codepoint > 126) codepoint += 160-126;
				// if(codepoint >= 173) codepoint++;
				// let char = String.fromCodePoint(codepoint);
				
				let char = glyphs[index];
				if(!char) continue;
				
				// var align = tinySDF.ctx.textAlign;
				// var buffer = tinySDF.buffer;
				// var middle = tinySDF.middle;
				
				// tinySDF.ctx.textAlign = 'center';
				// tinySDF.buffer = tinySDF.size/2;
				// tinySDF.middle = middle + diff[1]*scale
				
				// let sdf = tinySDF.draw(char);
				
				// const imageData = ctx.createImageData(sdf.width, sdf.height);
				// for (let i = 0; i < sdf.data.length; i++) {
				// 	imageData.data[4 * i + 0] = 255;
				// 	imageData.data[4 * i + 1] = 255;
				// 	imageData.data[4 * i + 2] = 255;
				// 	imageData.data[4 * i + 3] = sdf.data[i];
				// }
				// ctx.putImageData(imageData, x, y);
				
				
				// tinySDF.ctx.textAlign = align;
				// tinySDF.buffer = buffer;
				// tinySDF.middle = middle;
				
				ctx.fillStyle = 'lch(100 0 0';
				ctx.font = `400 50px Inter, sans-serif`;
				ctx.textBaseline = 'baseline';
				ctx.fillText(char, x, y + 50);
				
				
				ctx.fillStyle = 'lch(100 0 0%';
				ctx.font = `400 16px Inter, sans-serif`;
				ctx.textBaseline = 'middle';
				let metrics = ctx.measureText(char);
				
				let tx = (-0.5 + 1/8) + (1/4) * a;
				let ty = (-0.5 + 1/64) + (1/32) * b;
				glyphData[char] = [tx, -ty, metrics.width / 16];
				
				// ctx.fillStyle = 'lch(100 0 0%';
				// ctx.font = `400 16px Inter, sans-serif`;
				// ctx.textBaseline = 'middle';
				// ctx.fillText(codepoint, x + 64, y + 32);
				
				ctx.strokeStyle = 'green';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(2048, y);
				ctx.stroke();
			}
			
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, 2048);
			ctx.stroke();
			
			// ctx.beginPath();
			// ctx.strokeStyle = 'green';
			// ctx.moveTo(x, y + measure.fontBoundingBoxDescent);
			// ctx.lineTo(x + 30, y + measure.fontBoundingBoxDescent);
			// ctx.stroke();
		}
		
		
		// ctx.fillStyle = 'lch(100 0 0 / 30%';
		// ctx.font = `100 50px Inter, sans-serif`;
		// ctx.textBaseline = 'middle';
		
		// for(let a = 0; a < 2; ++a)
		// {
		// 	for(let b = 0; b < 16; ++b)
		// 	{
		// 		let index = b + a * 16;
		// 		let char = String.fromCodePoint(63 + index);
		// 		let measure = ctx.measureText(char);
		// 		let x = 10 + 512 * a;
		// 		let y = 32 + 64 * b;
		// 		ctx.fillText(char, x, y);
		// 	}
		// }
		
		// ctx.fillStyle = 'lch(100 0 0 / 30%';
		// ctx.font = `400 50px Inter, sans-serif`;
		// ctx.textBaseline = 'middle';
		
		// for(let a = 0; a < 2; ++a)
		// {
		// 	for(let b = 0; b < 16; ++b)
		// 	{
		// 		let index = b + a * 16;
		// 		let char = String.fromCodePoint(63 + index);
		// 		let measure = ctx.measureText(char);
		// 		let x = 10 + 512 * a;
		// 		let y = 32 + 64 * b;
		// 		ctx.fillText(char, x, y);
		// 	}
		// }
		
		// ctx.fillStyle = 'lch(100 0 0 / 30%';
		// ctx.font = `900 50px Inter, sans-serif`;
		// ctx.textBaseline = 'middle';
		
		// for(let a = 0; a < 2; ++a)
		// {
		// 	for(let b = 0; b < 16; ++b)
		// 	{
		// 		let index = b + a * 16;
		// 		let char = String.fromCodePoint(63 + index);
		// 		let measure = ctx.measureText(char);
		// 		let x = 10 + 512 * a;
		// 		let y = 32 + 64 * b;
		// 		ctx.fillText(char, x, y);
		// 	}
		// }
	}, []);
	
	const downloadCallback = useCallback(() => {
		let lsl = `
vector Glyphs(string Glyph) {
${glyphs.map(glyph => {
	let data = glyphData[glyph];
	if(glyph == '"') glyph = '\\"';
	else if(glyph == '\\') glyph = '\\\\';
	return `\tif(Glyph == "${glyph}") return <${data[0]}, ${data[1]}, ${data[2]}>;`
}).join('\n')}
	
	/* Ordered according to QWERTY keyboard letter frequency:
		e t a o i n s r h l d c u m f p g w y b , . v k ( ) _ ; " = ' - x /
		0 $ * 1 j : { } > q [ ] 2 z ! < ? 3 + 5 \ 4 # @ | 6 & 9 8 7 % ^ ~ \`
		Wasn't sure where to put upper case, so just put them where it made sense.
	*/
	return <0, 0, 0>;
}
`;
		console.log(lsl);
		
		let ctx = root.current.getContext('2d');
		let imageData = ctx.getImageData(0, 0, width, height);
		for(let i = 0; i < imageData.data.length; i += 4)
		{
			imageData.data[i + 0] = 255;
			imageData.data[i + 1] = 255;
			imageData.data[i + 2] = 255;
		}
		ctx.putImageData(imageData, 0, 0);
		
		root.current.toBlob(blob => {
			var url = URL.createObjectURL(blob);
			
			var downloadAnchor = document.createElement('a');
			downloadAnchor.href = url;
			downloadAnchor.setAttribute('download', 'Texture.png');
			downloadAnchor.click();
		}, 'image/png', 1);
	}, []);
	
	return <canvas class="texture" ref={root} onClick={downloadCallback}/>;
}



export function App() {
	return (
		<>
			<FontTexture/>
		</>
	)
}