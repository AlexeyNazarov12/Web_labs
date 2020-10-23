class Controller
{    
    constructor(view, model) {
        this.view = view;
        this.model = model;
		this.click_function = null;
        this.click_field_function = null;
		this.double_click_field_function = null;
		this.right_click_field_function = null;
    }
	
    click_button(event) {        
        this.model.fields_init(10, 10, 20); //количество строк поля, количество столбцов поля, количество бомб на поле
		this.view.hide_start_button();
		this.view.hide_prev_results();
		this.view.hide_results();
		this.view.render(this.model.get_count_col(), this.model.get_count_row());
		this.click_field_function = this.click_field_first.bind(this);
		this.view.set_field_click_function(this.click_field_function, null);
    }    
	
    click_field_first(event) {
		var index = this.view.get_number_clicked_field(event);
		this.model.set_bombs(index);
		this.model.set_values();
		this.open_field(index);
		
		this.view.show_prev_results(this.model.get_count_bomb());
		this.view.create_timer();
		
		this.click_field_function = this.click_field.bind(this); 
		this.double_click_field_function = this.double_click_field.bind(this);
		this.view.set_field_click_function(this.click_field_function, this.double_click_field_function);
		
		this.right_click_field_function = this.right_click_field.bind(this);
		this.view.set_field_right_click_function(this.right_click_field_function);
    }
	
	open_field(index) {
		var mas = this.model.get_values();
		var count_col = this.model.get_count_col();
		var count_row = this.model.get_count_row();
		
		// костыль для предотвращения ситуации, когда в главный массив неизвестно откуда добавляются два элемента: "-1" и "NaN"
		if (mas.length > count_col * count_row) this.model.fields_values.splice(count_col * count_row, 2);
		
		switch (mas[index]) {
			case -1:
				this.view.render_open_field(index, "url(assets/img/bomb2_field.png)");
				if (!this.view.check_flag_field(index)) this.view.defeat(mas, index);
				break;
			case 0:
				this.view.render_open_field(index, "url(assets/img/empty_field.png)");
				
				if ((index + 1) % count_col != 0 && this.view.check_closed_field(index + 1)) this.open_field(index + 1);
				if (index % count_col != 0 && this.view.check_closed_field(index - 1)) this.open_field(index - 1);
				
				if (index < (count_row - 1) * count_col) {
					if (this.view.check_closed_field(index + count_col)) this.open_field(index + count_col);
					if ((index + 1) % count_col != 0 && this.view.check_closed_field(index + count_col + 1)) this.open_field(index + count_col + 1);
					if (index % count_col != 0 && this.view.check_closed_field(index + count_col - 1)) this.open_field(index + count_col - 1);
				}
				
				if (index >= count_col) {
					if (this.view.check_closed_field(index - count_col)) this.open_field(index - count_col);
					if ((index + 1) % count_col != 0 && this.view.check_closed_field(index - count_col + 1)) this.open_field(index - count_col + 1);
					if (index % count_col != 0 && this.view.check_closed_field(index - count_col - 1)) this.open_field(index - count_col - 1);
				}
				break;
			case 1:
				this.view.render_open_field(index, "1,blue");
				break;
			case 2:
				this.view.render_open_field(index, "2,green");
				break;
			case 3:
				this.view.render_open_field(index, "3,red");
				break;
			case 4:
				this.view.render_open_field(index, "4,#00008B");
				break; 
			case 5:
				this.view.render_open_field(index, "5,#8B0000");
				break;
			case 6:
				this.view.render_open_field(index, "6,#00FFFF");
				break;
			case 7:
				this.view.render_open_field(index, "7,#00FFFF");
				break;
			case 8:
				this.view.render_open_field(index, "8,#00FFFF");
				break;
		}
	}
	
	open_neighboring_fields(index) {
		var count_col = this.model.get_count_col();
		var count_row = this.model.get_count_row();
		
		if ((index + 1) % count_col != 0) this.open_field(index + 1);
		if (index % count_col != 0) this.open_field(index - 1);
		
		if (index < (count_row - 1) * count_col) { 
			this.open_field(index + count_col);
			if ((index + 1) % count_col != 0) 
				this.open_field(index + count_col + 1); 
			if (index % count_col != 0) 
				this.open_field(index + count_col - 1); 
		}
		if (index >= count_col) { 
			this.open_field(index - count_col);
			if ((index + 1) % count_col != 0) 
				this.open_field(index - count_col + 1);
			if (index % count_col != 0) 
				this.open_field(index - count_col - 1); 
		}
	}
	
	click_field(event) { 
		var index = this.view.get_number_clicked_field(event);
		this.open_field(index);
		this.view.check_victory(this.model.get_values(), this.model.get_count_bomb()); 
    }
	
	double_click_field(event) {
		var index = this.view.get_number_clicked_field(event);
		this.open_neighboring_fields(index);
		this.view.check_victory(this.model.get_values(), this.model.get_count_bomb());
    }
	
	right_click_field(event) {
		var index = this.view.get_number_clicked_field(event);
		this.view.render_update_closed_field(index);
		this.view.check_victory(this.model.get_values(), this.model.get_count_bomb()); 
    }
	
    init() {    
		this.click_function = this.click_button.bind(this);
		this.view.set_button_click_function(this.click_function); 
    }
}

var controller = new Controller(view, model);
controller.init();
