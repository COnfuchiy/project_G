/**
 * Created by Dima on 19.08.2020.
 */
class Monster {
    constructor(platforms_width, height, sprite, items) {
        this._platforms_width = platforms_width;
        this._height = height;
        this._sprites = sprite;
        this._items = items;
        return this;
    }

    set_mob(x) {
        let animate_counter = 0;
        let animate_speed = 0;
        let mob_life = 2;
        Crafty.e('2D, Canvas, Collision, SpriteAnimation, ' + this._sprites.name)
            .attr({
                x: x + this._sprites.w,
                y: this._height - this._sprites.h,
            })
            .onHit('player', function (e) {
                e[0].obj.destroy();
            })
            .onHit('cd',function (e) {
                e[0].obj.destroy();
                mob_life--;
                if (mob_life===0){
                    user_score += MonsterSpawn.destriy_score;
                    user_score_text.text(user_score.toString());
                    this.destroy();
                }

            })
            .reel('back', 800, this._sprites.reels[1])
            .reel('ahead', 800, this._sprites.reels[0])
            .bind("UpdateFrame", function () {
                if (this.x < document.documentElement.clientWidth) {
                    if (!animate_speed) {
                        animate_speed = 1;
                        this.animate('ahead', -1);
                    }
                    animate_counter++;
                    if (animate_counter > 40) {
                        animate_speed = -1;
                        if (!this.isPlaying('back'))
                            this.animate('back', -1);
                    }
                    if (animate_counter > 80) {
                        animate_counter = 0;
                        animate_speed = 0;
                    }
                }
                this.x = this.x - Platforms.current_speed - animate_speed;
                if (this.x < -this.w)
                    this.destroy();

            });
    }

    spawn() {
        if (!this._items.length) {
            let mob_x = this.calc_x_spawn();
            this.set_mob(mob_x);
        }
        else {
            if (this._items.length === 1 && this._platforms_width === 93)
                return;
            if (this._items.length === 2 && this._platforms_width === 267)
                return;
            let non_occupied_positions = [93, 180, 267, 354];
            non_occupied_positions.map((item, index)=>{
                if (item>this._platforms_width)
                    non_occupied_positions.splice(index,1);
            });

            for (let item_x of this._items) {
                item_x -= Platforms.level_x;
                if (item_x < 93)
                    non_occupied_positions.splice(0, 1);
                if (item_x > 93 && item_x < 180)
                    non_occupied_positions.splice(1, 1);
                if (item_x > 180 && item_x < 267)
                    non_occupied_positions.splice(2, 1);
                if (item_x > 267)
                    non_occupied_positions.splice(3, 1);
            }
            let mob_x = non_occupied_positions[getRandomInt(non_occupied_positions.length - 1)];
            switch (mob_x) {
                case 93:
                    this.set_mob(Platforms.level_x + 20);
                    break;
                case 180:
                    this.set_mob(Platforms.level_x + 110);
                    break;
                case 267:
                    this.set_mob(Platforms.level_x + 200);
                    break;
                case 354:
                    this.set_mob(Platforms.level_x + 290);
                    break;
            }


        }
    }

    calc_x_spawn() {
        switch (this._platforms_width) {
            case 93:
                return Platforms.level_x + 20;
            case 180:
                return Platforms.level_x + 20 + getRandomInt(1) * 90;
            case 267:
                return Platforms.level_x + 20 + getRandomInt(2) * 90;
            case 354:
                return Platforms.level_x + 20 + getRandomInt(3) * 90;
        }

    }
}

class MonsterSpawn {
    static sprite_monsters = [
        {
            name: 'robot_1',
            type: 'sort_walking',
            reels: [
                [[15, 0], [14, 0], [13, 0], [12, 0], [11, 0], [10, 0], [9, 0], [8, 0]],// to left
                [[7, 0], [2, 0], [3, 0], [4, 0], [4, 0], [5, 0], [6, 0], [7, 0]] // to right
            ],
            w: 32,
            h: 50
        }
    ];
    static destriy_score = 200;
    static chance_spawn = 30;

    static get_spawn(platforms_width, height, items) {
        if (MonsterSpawn.check_spawn()) {
            (new Monster(platforms_width, height, MonsterSpawn.sprite_monsters[0], items)).spawn();
        }
    }

    static check_spawn() {
        return MonsterSpawn.chance_spawn > (getRandomInt(99) + 1)
    }
}