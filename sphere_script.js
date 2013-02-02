var sphere = new Sphere3D();
var html5logo = new Image();
var html5radius = 50;
var html5direction = 0.5;
var rotation = 0;
var distance = 0;

function Point3D() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

function Sphere3D(radius) {
	this.point = new Array(); 
	this.color = "rgb(50,85,155)" //This Changes the color for the spheres. 
	this.radius = ( typeof (radius) == "undefined") ? 20.0 : radius;
	this.radius = ( typeof (radius) != "number") ? 20.0 : radius;
	this.numberOfVertexes = 0;

	// Ciclo da 0ø a 360ø con passo di 10ø...calcola la circonf. di mezzo
	// Cycle from 0o to 360o with a pitch of 10o ... calculates the circumf. middle
	for ( alpha = 0; alpha <= 6.28; alpha += 0.17) {
		p = this.point[this.numberOfVertexes] = new Point3D();

		p.x = Math.cos(alpha) * this.radius;
		p.y = 0;
		p.z = Math.sin(alpha) * this.radius;

		this.numberOfVertexes++;
	}

	// Ciclo da 0ø a 90ø con passo di 10ø...calcola la prima semisfera (direction = 1)
	// Cycle 0o to 90ø with a pitch of 10o ... calculates the first hemisphere (direction = 1)
	
	// Ciclo da 0ø a 90ø con passo di 10ø...calcola la seconda semisfera (direction = -1)
	//Cycle 0o to 90ø with a pitch of 10o ... calculates the second hemisphere (direction = -1)
	for (var direction = 1; direction >= -1; direction -= 2) {
		for (var beta = 0.17; beta < 1.445; beta += 0.17) {
			var radius = Math.cos(beta) * this.radius;
			var fixedY = Math.sin(beta) * this.radius * direction;

			for (var alpha = 0; alpha < 6.28; alpha += 0.17) {
				p = this.point[this.numberOfVertexes] = new Point3D();

				p.x = Math.cos(alpha) * radius;
				p.y = fixedY;
				p.z = Math.sin(alpha) * radius;

				this.numberOfVertexes++;
			}
		}
	}

}

function rotateX(point, radians) {
	var y = point.y;
	point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
	point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
}

function rotateY(point, radians) {
	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
	point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
}

function rotateZ(point, radians) {
	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
	point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
}

function projection(xy, z, xyOffset, zOffset, distance) {
	return ((distance * xy) / (z - zOffset)) + xyOffset;
}

function render() {
	var canvas = document.getElementById("sphere3d");
	var width = canvas.getAttribute("width");
	var height = canvas.getAttribute("height");
	var ctx = canvas.getContext('2d');
	var x, y;

	var p = new Point3D();

	ctx.save();
	ctx.clearRect(0, 0, width, height);
	drawHtml5Logo(ctx, 10, 10);

	ctx.globalCompositeOperation = "lighter";

	for ( i = 0; i < sphere.numberOfVertexes; i++) {

		p.x = sphere.point[i].x;
		p.y = sphere.point[i].y;
		p.z = sphere.point[i].z;

		rotateX(p, rotation);
		rotateY(p, rotation);
		rotateZ(p, rotation);

		x = projection(p.x, p.z, width / 2.0, 100.0, distance);
		y = projection(p.y, p.z, height / 2.0, 100.0, distance);

		if ((x >= 0) && (x < width)) {
			if ((y >= 0) && (y < height)) {
				if (p.z < 0) {
					drawPoint(ctx, x, y, 4, "rgba(255,0,0,0.6)");
				} else {
					drawPointWithGradient(ctx, x, y, 10, "rgb(255,0,0)", 0.8);
				}
			}
		}
	}
	ctx.restore();
	ctx.fillStyle = "rgb(150,150,150)";
	ctx.fillText("di Guido D'Albore", width - 90, height - 5);
	rotation += Math.PI / 90.0;

	if (distance < 1000) {
		distance += 10;
	}
}

function drawPoint(ctx, x, y, size, color) {
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(x, y, size, 0, 2 * Math.PI, true);
	ctx.fill();
	ctx.restore();
}

function drawPointWithGradient(ctx, x, y, size, color, gradient) {
	var reflection;

	reflection = size / 4;

	ctx.save();
	ctx.translate(x, y);
	var radgrad = ctx.createRadialGradient(-reflection, -reflection, reflection, 0, 0, size);

	radgrad.addColorStop(0, '#FFFFFF');
	radgrad.addColorStop(gradient, color);
	radgrad.addColorStop(1, 'rgba(1,159,98,0)');

	ctx.fillStyle = radgrad;
	ctx.fillRect(-size, -size, size * 2, size * 2);
	ctx.restore();
}

function drawHtml5Logo(ctx, x, y) {

	html5radius += html5direction;

	if ((html5radius < 40) || (html5radius >= 60)) {
		html5direction *= -1;
	}

	ctx.save();
	//ctx.scale(0.8,0.8);
	drawHalo(ctx, x + (html5logo.width / 2), y + (html5logo.height / 2), html5radius, "rgb(255,255,255)", 0.1);
	ctx.drawImage(html5logo, x, y);
	ctx.restore();
}

function drawHalo(ctx, x, y, size, color, gradient) {
	var reflection;

	reflection = size / 4;

	ctx.save();
	ctx.translate(x, y);
	var radgrad = ctx.createRadialGradient(0, 0, reflection, 0, 0, size);

	radgrad.addColorStop(0, '#FFFFFF');
	radgrad.addColorStop(gradient, color);
	radgrad.addColorStop(1, 'rgba(1,159,98,0)');

	ctx.fillStyle = radgrad;
	ctx.fillRect(-size, -size, size * 2, size * 2);
	ctx.restore();
}

function init() {
	// Set framerate to 30 fps
	setInterval(render, 1000 / 30);

	html5logo.src = "html5-badge-h-solo.png";
}
