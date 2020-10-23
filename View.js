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
				var block1 = document.createElement("div");
				block1.className = "field";
				block1.id = (j + count_col * i).toString();
				block1.style.backgroundImage = "url(assets/img/closed_field.png)";
				inner_table += block1.outerHTML;
				inner_table += "</td>";
			}
			inner_table += "</tr>";
        }
		
		this.tab_fields.innerHTML = inner_table;
		this.tab_fields.style.display = "block";
    }
	
	render_open_field(id_field, text) {
		var field = document.getElementById(id_field.toString());
		if (field.style.backgroundImage != "url(\"assets/img/closed_field.png\")") return;
		
		if (text.indexOf(',') != -1) {
			var mas = text.split(',');
			field.style.backgroundImage = "url(assets/img/empty_field.png)";	
			this.set_block_properties(field, mas[0], mas[1]);
		} else {
			field.style.backgroundImage = text;
		}
	}
	
	set_block_properties(block, text, color) {
		block.innerHTML = text;
		block.style.color = color;
		block.style.fontSize = "45px";
		block.style.fontWeight = "900";
	}
	
	render_update_closed_field(id_field) {
		var field = document.getElementById(id_field.toString());
		
		if (field.style.backgroundImage == "url(\"assets/img/closed_field.png\")") {
			field.style.backgroundImage = "url(assets/img/flag_field.jpg)";
			this.count_bombs_decrement();
		}
		else if (field.style.backgroundImage == "url(\"assets/img/flag_field.jpg\")") { 
			field.style.backgroundImage = "url(assets/img/question_field.png)";
			this.count_bombs_increment(); 
		}
		else if (field.style.backgroundImage == "url(\"assets/img/question_field.png\")")
			field.style.backgroundImage = "url(assets/img/closed_field.png)";
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
		if (document.getElementById(index.toString()).style.backgroundImage == "url(\"assets/img/closed_field.png\")")
			return true;
		else
			return false;
	}
	
	check_flag_field(index) {
		if (document.getElementById(index.toString()).style.backgroundImage == "url(\"assets/img/flag_field.jpg\")")
			return true;
		else
			return false;
	}
	
	check_victory(fields_values, count_bombs) {
		var num = 0;
		for (let i = 0; i < fields_values.length; i++) {
			var elem = document.getElementById(i.toString());
			if (elem.style.backgroundImage == "url(\"assets/img/closed_field.png\")" ||
				elem.style.backgroundImage == "url(\"assets/img/flag_field.jpg\")") 
				num++;
		}
		if (num == count_bombs) this.victory(fields_values);
	}
	
	victory(fields_values) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы победили!";
		elem.style.display = "block";
		elem.style.color = "green";
		
		for (let i = 0; i < fields_values.length; i++) if (fields_values[i] == -1) document.getElementById(i.toString()).style.backgroundImage = "url(assets/img/bomb1_field.png)";
		setTimeout(this.new_game.bind(this), 3000);
		this.kill_timer();
	}
	
	defeat(fields_values, id_field) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы проиграли.";
		elem.style.display = "block";
		elem.style.color = "red";
		
		for (let i = 0; i < fields_values.length; i++) 
			if (fields_values[i] == -1 && i != id_field) 
				document.getElementById(i.toString()).style.backgroundImage = "url(assets/img/bomb1_field.png)";
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
            if (element == event.target) {
                return i;
            }
        }
    }
}

var view = new View();