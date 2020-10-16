const double_click_threshold = 250; 
//если через заданное количество миллисекунд будет совершен второй клик, то будет вызвана функция для двойного клика по мыши 

function mouse_clicker(click_function, double_click_function) {
    let timer;

    return function (event) {
        const context = this;

        if (timer) {
            clearTimeout(timer);
            double_click_function.call(context, event);
            timer = null;
            return;
        }

        timer = setTimeout(function (ctx) {
            timer = null;
            click_function.call(ctx, event);
        }, double_click_threshold, context);
    }
}