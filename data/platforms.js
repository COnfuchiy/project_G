class PlatformLevel {
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
            ItemDrop.get_drop(Platforms.get_sprite_wigth(Platforms.random_wight[this._random_count]),this._y_level);
            Crafty.e('2D, Canvas, Floor, '+Platforms.random_wight[this._random_count])
                .attr({
                    x: this._x_level,
                    y: this._y_level,

                })
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
    static random_wight =['platx2','platx4','platx3','plat','platx3','platx2', 'platx4'];
    static random_delay = [2000,2700,2200, 1800,2500,2150, 2400];
    static start_delay = [3000, 1500,3500,1700];
    static current_speed = 4;
    static level_x = document.documentElement.clientWidth+100;

    static loop() {
        for (let i = 0; i < Platforms.num_level; i++) {
            (new PlatformLevel(Platforms.level_y[i], Platforms.level_x)).start(Platforms.start_delay[i]);
        }
    }

    static get_level_wights() {
        let levels_arr = [];
        for (let i = 0; i < Platforms.num_level; i++) {
            levels_arr.push(i * Platforms.spacing_plat + Platforms.spacing_plat);
        }
        return levels_arr
    }
    static get_sprite_wigth(sprite_name){
        switch (sprite_name){
            case 'plat':
                return 93;
            case 'platx2':
                return 180;
            case 'platx3':
                return 267;
            case 'platx4':
                return 354;
        }
    }
}
