class Model 
{
	constructor() {
		this.fields_values = []; //"-1" - бомба, "0" - ничего, "1-8" - количество бомб вокруг поля
		
		this.count_bombs = 0;
		this.count_col = 0;
		this.count_row = 0;
	}
	
	fields_init(fields_row, fields_col, count_bombs) {
		this.count_col = fields_col;
		this.count_row = fields_row;
		this.count_bombs = count_bombs;
		
		for (let i = 0; i < this.count_row * this.count_col; i++) {
			this.fields_values[i] = 0;
		}
	}
	
	set_bombs(except) {
		var except_mas = [except, except + 1, except - 1, except - this.count_col, except + this.count_col,
						  except - this.count_col - 1, except - this.count_col + 1, 
						  except + this.count_col - 1, except + this.count_col + 1];
		
		var count_bombs_2 = this.count_bombs;
		
		while (count_bombs_2 > 0) {
			var i = Math.floor(Math.random() * (this.count_col * this.count_row + 1));
			
			if (except_mas.indexOf(i) == -1 && this.fields_values[i] != -1) {
				this.fields_values[i] = -1;
				count_bombs_2--;
			}
		}
		
		var count_bombs_2 = 0;
	}
	
	set_values() {
		for (let i = 0; i <= this.count_row * this.count_col; i++) {
			if (this.fields_values[i] == -1) {
				if (i % this.count_col != 0 && this.fields_values[i - 1] != -1) 
					this.fields_values[i - 1] += 1;
				if ((i + 1) % this.count_col != 0 && this.fields_values[i + 1] != -1) this.fields_values[i + 1] += 1; 
				
				if (i >= this.count_col) { 
					if (this.fields_values[i - this.count_col] != -1) 
						this.fields_values[i - this.count_col] += 1;
					if (i % this.count_col != 0 && this.fields_values[i - this.count_col - 1] != -1) 
						this.fields_values[i - this.count_col - 1] += 1;
					if ((i + 1) % this.count_col != 0 && this.fields_values[i - this.count_col + 1] != -1) 
						this.fields_values[i - this.count_col + 1] += 1; 
				}

				if (i < (this.count_row - 1) * this.count_col) {
					if (this.fields_values[i + this.count_col] != -1) 
						this.fields_values[i + this.count_col] += 1;
					if (i % this.count_col != 0 && this.fields_values[i + this.count_col - 1] != -1) 
						this.fields_values[i + this.count_col - 1] += 1;
					if ((i + 1) % this.count_col != 0 && this.fields_values[i + this.count_col + 1] != -1) 
						this.fields_values[i + this.count_col + 1] += 1;
				}
			}
		} 
	}
	
	get_values() {
		return this.fields_values;
	}
	
	get_count_col() {
		return this.count_col;
	}
	
	get_count_row() {
		return this.count_row;
	}
	
	get_count_bomb() {
		return this.count_bombs;
	}
}

var model = new Model();
