class View
{
	constructor() {
		this.tab_fields = document.getElementById("fields");
		this.tab_fields.style.display = "none";            
        this.button = document.getElementById("button");
		document.body.oncontextmenu = function (e) { return false; }; //не вызывать браузерное контекстное меню на странице
		
		this.timer_id = null;
		
		this.size_field = 50;
		this.size_between_fields = 5;
		
		this.count_col = 0;
		this.count_row = 0;
		
		this.map_view_fields = [];	//0 - закрытое поле
									//1 - открытое поле
									//2 - значок флажка
									//3 - значок вопроса
	}
	
	render(count_col, count_row) {     
		this.count_col = count_col;
		this.count_row = count_row;
		
		var size_field = this.size_field;
		var size_between_fields = this.size_between_fields;
		
		for (let i = 0; i < count_row; i++) {
			this.map_view_fields[i] = [];
			for (let j = 0; j < count_col; j++) this.map_view_fields[i][j] = 0;
		}
			
		this.tab_fields.innerHTML = "";
		
		var canvas_elem = document.createElement("canvas");
		canvas_elem.id = "canvas_id";

		canvas_elem.height = (size_field * count_col + size_between_fields * count_col - size_between_fields).toString();
		canvas_elem.width = (size_field * count_row + size_between_fields * count_row - size_between_fields).toString();
		
		this.tab_fields.appendChild(canvas_elem);
		
		var ctx = canvas_elem.getContext("2d");
		
		var pic = new Image();
		pic.src = "assets/img/closed_field.png";
		
		pic.onload = function() {
			for (let i = 0; i < count_row; i++) {
				for (let j = 0; j < count_col; j++) {
					ctx.drawImage(pic,
						i < 1 ? (size_field * i) : (size_field * i + size_between_fields * i), 
						j < 1 ? (size_field * j) : (size_field * j + size_between_fields * j), 
					size_field, size_field);
				}
			}
		}
		
		this.tab_fields.style.display = "block";
    }
	
	render_open_field(id_field, text) {
		var str_id_field = id_field.toString();
		
		var matrix_x = this.get_matrix_coord_x(id_field);
		var matrix_y = this.get_matrix_coord_y(id_field);
		
		if (this.map_view_fields[matrix_y][matrix_x] == 0)
			this.map_view_fields[matrix_y][matrix_x] = 1;
		else return;
		
		//рисование
		
		var holst_x = this.get_holst_coord(matrix_x);
		var holst_y = this.get_holst_coord(matrix_y);
		
		var ctx = document.getElementById("canvas_id").getContext("2d");
		ctx.font = "bold 35px sans-serif";
		
		var pic = new Image();
		pic.src = text.indexOf(',') != -1 ? "assets/img/empty_field.png" : text.substr(4, text.length - 5);
		
		pic.onload = (function() {
			ctx.drawImage(pic, holst_x, holst_y, this.size_field, this.size_field); 
			
			if (text.indexOf(',') != -1) {
				var mas = text.split(','); //mas[0] - цифра, mas[1] - цвет
				ctx.fillStyle = mas[1];
				ctx.fillText(mas[0], holst_x + this.size_field / 3, holst_y + this.size_field / 1.4);
			} 
		}).bind(this);
	}
	
	render_update_closed_field(id_field) {
		var matrix_x = this.get_matrix_coord_x(id_field);
		var matrix_y = this.get_matrix_coord_y(id_field);
		
		var holst_x = this.get_holst_coord(matrix_x);
		var holst_y = this.get_holst_coord(matrix_y);
				
		var ctx = document.getElementById("canvas_id").getContext("2d");
		var pic = new Image();
		
		if (this.map_view_fields[matrix_y][matrix_x] == 0) {
			pic.src = "assets/img/flag_field.jpg";
			
			pic.onload = (function() {
				ctx.drawImage(pic, holst_x, holst_y, this.size_field, this.size_field);
			}).bind(this);
			
			this.map_view_fields[matrix_y][matrix_x] = 2;
			this.count_bombs_decrement();
		}
		else if (this.map_view_fields[matrix_y][matrix_x] == 2) { 
			pic.src = "assets/img/question_field.png";
			
			pic.onload = (function() {
				ctx.drawImage(pic, holst_x, holst_y, this.size_field, this.size_field);
			}).bind(this);
			
			this.map_view_fields[matrix_y][matrix_x] = 3;
			this.count_bombs_increment(); 
		}
		else if (this.map_view_fields[matrix_y][matrix_x] == 3) {
			pic.src = "assets/img/closed_field.png";
			
			pic.onload = (function() {
				ctx.drawImage(pic, holst_x, holst_y, this.size_field, this.size_field);
			}).bind(this);
			
			this.map_view_fields[matrix_y][matrix_x] = 0;
		}
	}
	
	get_matrix_coord_x(id_field) {
		var num_col_field = id_field % this.count_col; 
		return num_col_field;
	}
	
	get_matrix_coord_y(id_field) {
		var num_row_field = 0;
		
		var str_id_field = id_field.toString();
		if (str_id_field.length > 1) num_row_field = parseInt(str_id_field.substr(0, str_id_field.length - 1));
		
		return num_row_field;
	}
	
	get_holst_coord(matrix_coord) {
		var holst_coord = 
			matrix_coord == 0 
				? this.size_field * matrix_coord
				: this.size_field * matrix_coord + this.size_between_fields * matrix_coord;
		return holst_coord;
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
		var matrix_x = this.get_matrix_coord_x(index);
		var matrix_y = this.get_matrix_coord_y(index);
		
		if (this.map_view_fields[matrix_y][matrix_x] == 0)
			return true;
		else
			return false;
	}
	
	check_flag_field(index) {
		var matrix_x = this.get_matrix_coord_x(index);
		var matrix_y = this.get_matrix_coord_y(index);
		
		if (this.map_view_fields[matrix_y][matrix_x] == 2)
			return true;
		else
			return false;
	}
	
	check_victory(fields_values, count_bombs) {
		var count_find_bombs = 0;
		
		for (let i = 0; i < this.count_row; i++)
			for (let j = 0; j < this.count_col; j++)
				if (this.map_view_fields[i][j] == 0 || this.map_view_fields[i][j] == 2) count_find_bombs++;
			
		if (count_find_bombs == count_bombs) this.victory(fields_values);
	}
	
	victory(fields_values) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы победили!";
		elem.style.display = "block";
		elem.style.color = "green";
		
		var ctx = document.getElementById("canvas_id").getContext("2d");
		var pic = new Image();
		pic.src = "assets/img/bomb1_field.png";
		
		var size_field = this.size_field;
		
		pic.onload = (function() {
			for (let i = 0; i < fields_values.length; i++) 
				if (fields_values[i] == -1) {
					var matrix_x = this.get_matrix_coord_x(i);
					var matrix_y = this.get_matrix_coord_y(i);
					
					var holst_x = this.get_holst_coord(matrix_x);
					var holst_y = this.get_holst_coord(matrix_y);
					
					ctx.drawImage(pic, holst_x, holst_y, size_field, size_field); 
				}
		}).bind(this);
		
		setTimeout(this.new_game.bind(this), 3000);
		this.kill_timer();
	}
	
	defeat(fields_values, id_field) {
		var elem = document.getElementById("result"); 
		elem.innerHTML = "Вы проиграли.";
		elem.style.display = "block";
		elem.style.color = "red";
		
		var ctx = document.getElementById("canvas_id").getContext("2d");
		var pic = new Image();
		pic.src = "assets/img/bomb1_field.png";
		
		var size_field = this.size_field;
		
		pic.onload = (function() {
			for (let i = 0; i < fields_values.length; i++) 
				if (fields_values[i] == -1 && i != id_field) {
					var matrix_x = this.get_matrix_coord_x(i);
					var matrix_y = this.get_matrix_coord_y(i);
					
					var holst_x = this.get_holst_coord(matrix_x);
					var holst_y = this.get_holst_coord(matrix_y);
					
					ctx.drawImage(pic, holst_x, holst_y, size_field, size_field); 
				}
		}).bind(this);
				
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
        var fields = document.getElementById("canvas_id");
		
		if (click_field_function2 != null) fields.onclick = mouse_clicker(click_field_function1, click_field_function2);
		else fields.onclick = click_field_function1;
			
		fields.onselectstart = function(e) { return false; };
		fields.onmousedown = function(e) { return false; };
    }
	
	set_field_right_click_function(click_field_function) {
        var fields = document.getElementById("canvas_id");
		fields.oncontextmenu = click_field_function;
    }
	
	get_number_clicked_field(event) {
        var fields = document.getElementById("canvas_id");
		
		var x = event.offsetX;
		var y = event.offsetY;
		
		var id = 0;
		
		for (let i = 0; i < this.count_row; i++) 
			for (let j = 0; j < this.count_col; j++) {
				var holst_y = this.get_holst_coord(i);
				var holst_x = this.get_holst_coord(j);
				
				if (x >= holst_x && x <= holst_x + this.size_field && y >= holst_y && y <= holst_y + this.size_field) {
					id = (i * 10) + (j + 1);
					id--;
					return id;
				}
			}
    }
}

var view = new View();