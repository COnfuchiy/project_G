class PlatformLevel {
    constructor(level_y, level_x) {
        this._level_y = level_y;
        this._level_x = level_x;
        this._random_count = getRandomInt(Platforms.random_platforms.length-2);
        return this;
    }

    start(delay) {
        this._loop =Crafty.e("Delay").delay(() => {
            if (!Crafty.isPaused()) {
                if (is_active_spawn) {
                    let item_spawn = ItemDrop.get_drop(Platforms.get_sprite_width(Platforms.random_platforms[this._random_count].name), this._level_y);
                    MonsterSpawn.get_spawn(Platforms.get_sprite_width(Platforms.random_platforms[this._random_count].name), this._level_y, item_spawn);
                }
                Crafty.e('2D, Canvas, ' +Platforms.name_component+', '+Platforms.component_for_mob+', '+ Platforms.random_platforms[this._random_count].name)
                    .attr({
                        x: this._level_x,
                        y: this._level_y,
                        z: Platforms.z_index
                    })
                    .bind("UpdateFrame", function () {
                        this.x = this.x - Platforms.current_speed;
                        if (this.x < -this.w)
                            this.destroy();
                    });
                this.start(Platforms.random_platforms[this._random_count].delay);
                this._random_count++;
                if (this._random_count === Platforms.random_platforms.length)
                    this._random_count = getRandomInt(Platforms.random_platforms.length-2);
            }
                else
                    this.start(delay);
        }, delay);
    }
}

class Platforms {
    static name_component = Setting.platforms.name_component;
    static component_for_mob = Setting.platforms.component_for_mob;
    static platforms_levels = [];
    static spacing_plat = Setting.platforms.spacing_plat;
    static num_levels = Setting.platforms.num_levels;
    static levels_y = Platforms.get_level_wights();
    static random_platforms = Setting.platforms.pseudo_random_platforms;
    static start_delay = Setting.platforms.start_delay;
    static current_speed = Setting.platforms.current_speed;
    static level_x = Setting.screen.width;
    static z_index = Setting.platforms.z_index;
    static sprites = Setting.platforms.sprites;

    static stop_loop(){
        for (let level of Platforms.platforms_levels){
            level._loop.destroy();
        }
    }

    static loop() {
        for (let i = 0; i < Platforms.num_levels; i++) {
            Platforms.platforms_levels.push(new PlatformLevel(Platforms.levels_y[i], Platforms.level_x));
            Platforms.platforms_levels[i].start(Platforms.start_delay[i]);
        }
    }

    static get_level_wights() {
        let levels_arr = [];
        for (let i = 0; i < Platforms.num_levels; i++) {
            levels_arr.push(i * Platforms.spacing_plat + Platforms.spacing_plat);
        }
        return levels_arr
    }

    static get_sprite_width(sprite_name) {
        switch (sprite_name) {
            case Platforms.sprites[0].name:
                return Platforms.sprites[0].w;
            case Platforms.sprites[1].name:
                return Platforms.sprites[1].w;
            case Platforms.sprites[2].name:
                return Platforms.sprites[2].w;
            case Platforms.sprites[3].name:
                return Platforms.sprites[3].w;
        }
    }
}
