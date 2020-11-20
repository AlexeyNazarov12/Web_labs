class View
{
	constructor() {
		this.tab_fields = document.getElementById("fields");
		this.tab_fields.style.display = "none";            
        this.button = document.getElementById("button");
		document.body.oncontextmenu = function (e) { return false; }; //не вызывать браузерное контекстное меню на странице
		
		this.timer_id = null;
	}
	
	render(count_col, count_row) {        
        this.tab_fields.innerHTML = "";
		
		var inner_table = "";
		
        for (let i = 0; i < count_row; i++) {
			inner_table += "<tr>";
			for (let j = 0; j < count_col; j++) {
				inner_table += "<td>";
				
				var block = document.createElement("div");
				block.className = "field";
				block.id = (j + count_col * i).toString();
				
				var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				svg.setAttribute('width', '50');
				svg.setAttribute('height', '50');	
				
				svg.appendChild(this.render_svg_img('100%', 'assets/img/closed_field.png'));
				
				block.appendChild(svg);
				
				inner_table += block.outerHTML;
				inner_table += "</td>";
			}
			inner_table += "</tr>";
        }
		
		this.tab_fields.innerHTML = inner_table;
		this.tab_fields.style.display = "block";
    }
	
	render_svg_text(x, y, style, txt) {
		var svg_text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		
		svg_text.setAttribute('style', style); //'font-size: 35px; font-weight: bold; stroke: blue;'
		svg_text.setAttribute('x', x); 		   //16
		svg_text.setAttribute('y', y); 		   //36
		svg_text.textContent = txt;
		
		return svg_text;
	}
	
	render_svg_img(scale, url) {
		var svg_img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
		
		svg_img.setAttribute('xlink:href', url); //'assets/img/closed_field.png'
		svg_img.setAttribute('width', scale);
		svg_img.setAttribute('height', scale);
		
		return svg_img;
	}
	
	render_open_field(id_field, text) {
		var svg_elem = document.getElementById(id_field.toString()).childNodes[0];
		var svg_img = svg_elem.getElementsByTagName('image');
		
		var flag_path_elems = svg_elem.getElementsByTagName('path');
		
		if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') != "assets/img/closed_field.png" || 
			flag_path_elems.length > 0) return;
		
		if (text.indexOf(',') != -1) {
			var mas = text.split(',');
			
			svg_img[0].setAttribute('xlink:href', 'assets/img/empty_field.png');
			svg_elem.appendChild(this.render_svg_text('16', '36', 'font-size: 35px; font-weight: bold; stroke: ' + mas[1], mas[0])); 
		} else {
			svg_img[0].setAttribute('xlink:href', text.substr(4, text.length - 5));
		}
	}
	
	set_block_properties(block, text, color) {
		block.innerHTML = text;
		block.style.color = color;
		block.style.fontSize = "45px";
		block.style.fontWeight = "900";
	}
	
	render_update_closed_field(id_field) {
		var svg_elem = document.getElementById(id_field.toString()).childNodes[0];
		var svg_img = svg_elem.getElementsByTagName('image');
		
		var flag_path_elems = svg_elem.getElementsByTagName('path');
		
		//данные для рисования флажка (атрибут d элемента path)
		var flag_paths = [ 'M 10 15 L 27 10 V 20 Z', 
						   'M 23 15 V 30 H 15 V 34 H 10 V 38 H 40 V 34 H 35 V 30 H 27 V 10 Z' ];
		
		if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == 'assets/img/closed_field.png' &&
			flag_path_elems.length == 0) {
			
			//создание двух частей флажка с использованием данных из массива 
			var path_elem1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			var path_elem2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			
			path_elem1.setAttribute('d', flag_paths[0]);
			path_elem1.setAttribute('style', 'fill: red;');
			
			path_elem2.setAttribute('d', flag_paths[1]);
			path_elem2.setAttribute('style', 'fill: black;');
			
			//сохранение созданных элементов в svg
			svg_elem.appendChild(path_elem2);
			svg_elem.appendChild(path_elem1);
			
			this.count_bombs_decrement();
		}
		else if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == 'assets/img/closed_field.png' && 
				flag_path_elems.length != 0) {
				 
			svg_img[0].setAttribute('xlink:href', 'assets/img/question_field.png');
			
			while (flag_path_elems.length > 0) svg_elem.removeChild(flag_path_elems[0]);
			
			this.count_bombs_increment(); 
		}
		else if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == 'assets/img/question_field.png')
			svg_img[0].setAttribute('xlink:href', 'assets/img/closed_field.png');
	}
	
	count_bombs_increment() {
		var elem = document.getElementById("prev_result1");
		var num = Number.parseInt(elem.innerHTML);
		num++;
		elem.innerHTML = num.toString();
	}
	
	count_bombs_decrement() {
		var elem = document.getElementById("prev_result1");
		var num = Number.parseInt(elem.innerHTML);
		num--;
		elem.innerHTML = num.toString();
	}
	
	create_timer() {
		this.timer_id = setInterval(this.update_timer.bind(this), 1000);
	}
	
	update_timer() {
		var elem = document.getElementById("prev_result2");
		var time = Number.parseInt(elem.innerHTML);
		time++;
		elem.innerHTML = time.toString();
	}
	
	kill_timer() {
		clearTimeout(this.timer_id);
	}
	
	check_closed_field(index) {
		var svg_elem = document.getElementById(index.toString()).childNodes[0];
		var svg_img = svg_elem.getElementsByTagName('image');
		
		if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == "assets/img/closed_field.png")
			return true;
		else
			return false;
	}
	
	check_flag_field(index) {
		var svg_elem = document.getElementById(index.toString()).childNodes[0];
		var svg_img = svg_elem.getElementsByTagName('image');

		var flag_path_elems = svg_elem.getElementsByTagName('path');
		
		if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == "assets/img/closed_field.png" &&
			flag_path_elems.length > 0)
			return true;
		else
			return false;
	}
	
	check_victory(fields_values, count_bombs) {
		var num = 0;
		
		for (let i = 0; i < fields_values.length; i++) {
			var svg_elem = document.getElementById(i.toString()).childNodes[0];
			var svg_img = svg_elem.getElementsByTagName('image');
		
			if (svg_img[0].getAttributeNS('http://www.w3.org/1999/xlink', 'href') == 'assets/img/closed_field.png') 
				num++;
		}
		
		if (num == count_bombs) this.victory(fields_values);
	}
	
	victory(fields_values) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы победили!";
		elem.style.display = "block";
		elem.style.color = "green";
		
		for (let i = 0; i < fields_values.length; i++) 
			if (fields_values[i] == -1) {
				var svg_elem = document.getElementById(i.toString()).childNodes[0];
				var svg_img = svg_elem.getElementsByTagName('image');
				
				var flag_path_elems = svg_elem.getElementsByTagName('path');
				while (flag_path_elems.length > 0) svg_elem.removeChild(flag_path_elems[0]);
				
				svg_img[0].setAttribute('xlink:href', 'assets/img/bomb1_field.png');
			}
			
		setTimeout(this.new_game.bind(this), 3000);
		this.kill_timer();
	}
	
	defeat(fields_values, id_field) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы проиграли.";
		elem.style.display = "block";
		elem.style.color = "red";
		
		for (let i = 0; i < fields_values.length; i++) 
			if (fields_values[i] == -1 && i != id_field) {
				var svg_elem = document.getElementById(i.toString()).childNodes[0];
				var svg_img = svg_elem.getElementsByTagName('image');
				
				var flag_path_elems = svg_elem.getElementsByTagName('path');
				while (flag_path_elems.length > 0) svg_elem.removeChild(flag_path_elems[0]);
				
				svg_img[0].setAttribute('xlink:href', 'assets/img/bomb1_field.png');
			}
				
		setTimeout(this.new_game.bind(this), 3000);
		this.kill_timer();
	}
	
	new_game() {
		this.hide_fields();
		this.show_start_button();
	}
	
	show_start_button() {
		this.button.style.display = "block";
	}
	
	hide_start_button() {
		this.button.style.display = "none";
	}
	
	hide_fields() {
		document.getElementById("fields").style.display = "none";            
	}
	
	hide_results() {
		document.getElementById("result").style.display = "none";
	}
	
	show_prev_results(count_bombs) {
		var elem1 = document.getElementById("prev_result1");
		var elem2 = document.getElementById("prev_result2");
		
		elem1.innerHTML = count_bombs.toString();
		elem2.innerHTML = "0";
		
		elem1.style.display = "block";
		elem2.style.display = "block";
	}
	
	hide_prev_results() {
		var elem1 = document.getElementById("prev_result1");
		var elem2 = document.getElementById("prev_result2");
		
		elem1.style.display = "none";
		elem2.style.display = "none";
	}
	
	set_button_click_function(click_button_function){
        this.button.onclick = click_button_function;                
    }
	
	set_field_click_function(click_field_function1, click_field_function2) {
        var fields = document.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i++) {
            const element = fields[i];
			if (click_field_function2 != null) element.onclick = mouse_clicker(click_field_function1, click_field_function2);
			else element.onclick = click_field_function1;
			// для отмены выделения текста задаем следующие обработчики у событий onselectstart и onmousedown
			element.onselectstart = function(e) { return false; };
			element.onmousedown = function(e) { return false; };
        }
    }
	
	set_field_right_click_function(click_field_function) {
        var fields = document.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i++) {
            const element = fields[i];
            element.oncontextmenu = click_field_function;
        }
    }
	
	get_number_clicked_field(event) {
        var fields = document.getElementsByClassName("field");
        for (let i = 0; i < fields.length; i++) {
            const element = fields[i];
            if (element == event.path[2]) { //0 - элемент внутри svg, по которому произошел клик
											//1 - элемент svg
											//2 - нужный элемент div, внутри которого svg
                return i;
            }
        }
    }
}

var view = new View();