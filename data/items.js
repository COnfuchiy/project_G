/**
 * Created by Dima on 17.08.2020.
 */

class Item {
    constructor(type, platforms_width, height, sprite, score) {
        this._type = type;
        this._platforms_width = platforms_width;
        this._height = height;
        this._sprites = sprite;
        this._score = score;
        return this;
    }

    comp_drop(){
        let x = this.calc_x_drop();
        let comp_on = this._sprites[1].name;
        let twice_check = 0;
        Crafty.e('2D, Canvas, Collision,' + this._sprites[0].name)
            .attr({
                x: x-parseInt(this._sprites[0].w/2),
                y: this._height - this._sprites[0].h,
            })
            .onHit('player', function (e) {
                if (this[0]!==twice_check){
                    is_active_spawn = false;
                    twice_check = this[0];
                    computer_score += 1;
                    comp_score_text.text(computer_score.toString()+'/10');
                    if (computer_score===1){
                        Crafty.trigger('Boss');
                        computer_score = 0;
                        comp_score_text.text(computer_score.toString()+'/10');
                    }
                    this.sprite(comp_on);
                }

            })
            .bind("UpdateFrame", function () {
                this.x = this.x - Platforms.current_speed;
                if (this.x < -this.w)
                    this.destroy();
            });
        return [x];
    }

    set_item(x) {
        let item_score = this._score;
        let selected_sprite = Array.isArray(this._sprites)? this._sprites[getRandomInt(this._sprites.length)]:this._sprites;
        Crafty.e('2D, Canvas, Collision,' + selected_sprite.name)
            .attr({
                x: x-parseInt(selected_sprite.w/2),
                y: this._height - 10 - selected_sprite.h,
            })
            .onHit('player', function (e) {
                user_score += item_score;
                user_score_text.text(user_score.toString());
                this.destroy();
            })
            .bind("UpdateFrame", function () {
                this.x = this.x - Platforms.current_speed;
                if (this.x < -this.w)
                    this.destroy();
            });
    }

    drop() {
        if (getRandomInt(99) + 1 >= 85 && this._platforms_width > 180) {
            // double drop
            let first_item = this.calc_x_drop();
            let second_item = 0;
            if (first_item > 267) {
                second_item = Platforms.level_x + 45 + getRandomInt(1) * 90;
            }
            else {
                if (this._platforms_width === 267)
                    second_item = Platforms.level_x + 45 + 180;
                else
                    second_item = Platforms.level_x + 45 + 180 + getRandomInt(1) * 90;
            }
            this.set_item(first_item);
            this.set_item(second_item);
            return [first_item,second_item];
        } else {
            let item_x = this.calc_x_drop();
            this.set_item(item_x);
            return [item_x];
        }

    }

    calc_x_drop() {
        switch (this._platforms_width) {
            case 93:
                return Platforms.level_x + 45;
            case 180:
                return Platforms.level_x + 45 + getRandomInt(1) * 90;
            case 267:
                return Platforms.level_x + 45 + getRandomInt(2) * 90;
            case 354:
                return Platforms.level_x + 45 + getRandomInt(3) * 90;
        }

    }

}

class ItemDrop {
    static item_types = [
        {
            sprites: [
                {
                    name: 'proc',
                    w: 40,
                    h: 40,
                },
                {
                    name: 'proc_2',
                    w: 40,
                    h: 40,
                },
                {
                    name: 'proc_3',
                    w: 42,
                    h: 40,
                },
                {
                    name: 'proc_4',
                    w: 42,
                    h: 40,
                }
            ],
            score: 100,
            chance: 10,
        },
        {
            sprites: [
                {
                    name: 'motherboard',
                    w: 38,
                    h: 40,
                },
                {
                    name: 'motherboard_2',
                    w: 40,
                    h: 40,
                },
                {
                    name: 'motherboard_3',
                    w: 40,
                    h: 42,
                }
            ],
            score: 200,
            chance: 20,
        },
        {
            sprites: [
                {
                    name: 'fdisk',
                    w: 37,
                    h: 40,
                },
                {
                    name: 'fdisk_2',
                    w: 43,
                    h: 40,
                },
            ],
            score: 300,
            chance: 30,
        },
        {
            sprites: {
                name: 'cooler',
                w: 51,
                h: 40,
            },
            score: 400,
            chance: 40,
        },
        {
            sprites: {
                name: 'disk_driver',
                w: 57,
                h: 40,
            },
            score: 500,
            chance: 50,
        },
        {
            sprites: {
                name: 'graphics',
                w: 68,
                h: 40,
            },
            score: 600,
            chance: 60,
        },
        {
            sprites: {
                name: 'hdd',
                w: 31,
                h: 40,
            },
            score: 700,
            chance: 70,
        },
        {
            sprites: {
                name: 'headphones',
                w: 42,
                h: 40,
            },
            score: 800,
            chance: 80,
        },
        {
            sprites: {
                name: 'loudspeaker',
                w: 38,
                h: 40,
            },
            score: 500,
            chance: 90,
        },
        {
            sprites: {
                name: 'mouse',
                w: 29,
                h: 40,
            },
            score: 600,
            chance: 94,
        },
        {
            sprites: {
                name: 'usb',
                w: 59,
                h: 40,
            },
            score: 700,
            chance: 98,
        },
        {
            sprites: {
                name: 'wired_keyboard',
                w: 47,
                h: 40,
            },
            score: 800,
            chance: 100,
        },

    ];
    static special_items = [{
        sprites: [
            {
                name: 'comp_off',
                w: 62,
                h: 50,
            },
            {
                name: 'comp_on',
                w: 62,
                h: 50,
            },
        ],
    },];
    static chance_drop = 80;
    static computer_chance = 40;

    static get_drop(platforms_width, height) {
        if (ItemDrop.check_drop()) {
            let dropped_item = ItemDrop.get_type_of_drop();
            return (new Item(1, platforms_width, height,  dropped_item.sprites, dropped_item.score)).drop();
        }
        else{
            if (ItemDrop.check_comp_drop())
                return (new Item(1, platforms_width, height,  ItemDrop.special_items[0].sprites, 1)).comp_drop();
        }
        return [];

    }

    static check_drop() {
        return ItemDrop.chance_drop > (getRandomInt(99) + 1)
    }

    static check_comp_drop() {
        return ItemDrop.computer_chance > (getRandomInt(99) + 1)
    }

    static get_type_of_drop() {
        let random_num = getRandomInt(99) + 1;
        let last_item = ItemDrop.item_types[0];
        for (let i = 0; i < ItemDrop.item_types.length; i++) {
            if (random_num <= ItemDrop.item_types[i].chance)
                return last_item;
            else
                last_item = ItemDrop.item_types[i];
        }
    }
}