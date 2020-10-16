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
		this.view.render_open_field(index, this.model.get_values(), this.model.get_count_col(), this.model.get_count_row());
		
		this.view.show_prev_results(this.model.get_count_bomb());
		this.view.create_timer();
		
		this.click_field_function = this.click_field.bind(this); 
		this.double_click_field_function = this.double_click_field.bind(this);
		this.view.set_field_click_function(this.click_field_function, this.double_click_field_function);
		
		this.right_click_field_function = this.right_click_field.bind(this);
		this.view.set_field_right_click_function(this.right_click_field_function);
    }
	
	click_field(event) { 
		var index = this.view.get_number_clicked_field(event);
		this.view.render_open_field(index, this.model.get_values(), this.model.get_count_col(), this.model.get_count_row());
		this.view.check_victory(this.model.get_values(), this.model.get_count_bomb()); 
    }
	
	double_click_field(event) {
		var index = this.view.get_number_clicked_field(event);
		this.view.render_open_neighboring_fields(index, this.model.get_values(), this.model.get_count_col(), this.model.get_count_row());
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
