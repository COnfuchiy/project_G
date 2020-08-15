/**
 * Created by Dima on 14.08.2020.
 */

class Platform_level {
    constructor( y_level, x_level) {
        this._y_level = y_level;
        this._x_level = x_level;
        this._name = 'GEN_Platform';
        this._random_count = getRandomInt(5);
        return this;
    }

    start(delay) {

        setTimeout(() => {
            // delete color when get sprite
            Crafty.e('2D, Canvas, Floor, Color')
                .attr({
                    x: this._x_level,
                    y: this._y_level,
                    w: Platforms.random_wight[this._random_count],
                    h: 20
                })
                .color('#2dff00')
                .bind("UpdateFrame", function () {
                    this.x = this.x - Platforms.current_speed;
                    if (this.x < -this.w)
                        this.destroy();
                });
            this.start(Platforms.random_delay[this._random_count]);
            this._random_count++;
            if (this._random_count===7)
                this._random_count=getRandomInt(5);
        },delay);
    }
}

class Platforms {
    static spacing_plat = 100;
    static num_level = 4;
    static level_y = Platforms.get_level_wights();
    static random_wight =[280,304, 323, 310, 320, 331,390];
    static random_delay = [3000,2900,2800,2300, 2500,3700,2850];
    static start_delay = [3000, 1500,3500,1700];
    static current_speed = 4;
    static level_x = document.documentElement.clientWidth+100;

    static loop() {
        for (let i = 0; i < Platforms.num_level; i++) {
            (new Platform_level(Platforms.level_y[i], Platforms.level_x)).start(Platforms.start_delay[i]);
        }
    }

    static get_level_wights() {
        let levels_arr = [];
        for (let i = 0; i < Platforms.num_level; i++) {
            levels_arr.push(i * Platforms.spacing_plat + Platforms.spacing_plat);
        }
        return levels_arr
    }
}
