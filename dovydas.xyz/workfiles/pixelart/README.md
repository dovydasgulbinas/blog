1. Design your pixel art in pixelorama
2. Export your art to .png
3. In Inkscape go to File -> Document Properties (Shift + Ctrl + D)
	1. Select "Display Units" = px
	2. Customsize -> Units px
	3. Custom size -> Width: and Height = to match your pixel art
	4. Expand viewbox
		-> Scale x: = 1
		-> X: = 0
		-> Width: = (width of your pixel art)
		-> Height: = (height of your pixel art)


	6. Untick "Use antialiasing"

4. Add grids (Document Properties -> [Grids tab])
	Creation -> "Rectangular grid"

	| Rectangular grid |
	 Defined grids

	 -> Enabled = ☑
	 -> Visible = ☑
	 -> Snap to visible grid lines only = ☑

	Grid Units:
	Origin X: = 0
	Origin Y: = 0
	Spacing X: = 1
	Spacing Y: = 1
	...
	Major grid line every = 4
5. Add exported png to its own layer
6. Creates squares/pixels
5. Trace the image
6. Union: parts of the img
7. For background extraction use "Division"
8. Remove reference layer
9. Delete all other items
10. Export Simplifiend SVG (File -> Save As -> Optimized SVG)
	1. Collapse groups (optional)
	2. Number of Sig digits for coords = 1
	3. Untick convert css atribures to xml attributes
11. Open saved svg in code editor copy all <path> attribures


	





