/**
 * Created by Dima on 17.08.2020.
 */

class Item {
    constructor(platforms_width, height, sprites, score = 0, type = '') {
        this._platforms_width = platforms_width;
        this._height = height;
        this._sprites = sprites;
        this._score = score;
        this._type = type;
        return this;
    }

    comp_drop() {
        let x = ItemDrop.calc_middle_of_plat(this._platforms_width);
        let comp_on = this._sprites[1].name;
        let twice_check = 0;
        Crafty.e('2D, Canvas, Collision,' + this._sprites[0].name)
            .attr({
                x: x - parseInt(this._sprites[0].w / 2),
                y: this._height - this._sprites[0].h,
                z: ItemDrop.z_index_comp
            })
            .onHit('player', function () {
                if (this[0] !== twice_check) {
                    twice_check = this[0];
                    current_computer_score++;
                    comp_score_text.text(current_computer_score.toString() + '/' + total_computer_score);
                    if (current_computer_score === total_computer_score) {
                        Crafty.trigger('Boss');
                        current_computer_score = 0;
                        comp_score_text.text(current_computer_score.toString() + '/' + total_computer_score);
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

    baff_drop() {
        let x = ItemDrop.calc_middle_of_plat(this._platforms_width);
        let buff_item = Crafty.e('2D, Canvas, ' + ItemDrop.name_component + ',Collision, ' + this._sprites.name)
            .attr({
                x: x - parseInt(this._sprites.w / 2),
                y: this._height - ItemDrop.fly_drop_height - this._sprites.h,
                z: ItemDrop.z_index_drop
            })
            .bind("UpdateFrame", function () {
                this.x = this.x - Platforms.current_speed;
                if (this.x < -this.w)
                    this.destroy();
            });
        if (this._type === 'shield') {
            buff_item.onHit('player', function () {
                this.destroy();
                Crafty.trigger('Shield');
            })
        }
        else if (this._type === 'magnet') {
            buff_item.onHit('player', function () {
                this.destroy();
                Crafty.trigger('Magnet');
            })
        }
        else {
            buff_item.onHit('player', function () {
                this.destroy();
                Crafty.trigger('Increase');
            })
        }
        return [x];

    }

    set_item(x) {
        let item_score = this._score;
        let selected_sprite = Array.isArray(this._sprites) ? this._sprites[getRandomInt(this._sprites.length)] : this._sprites;
        Crafty.e('2D, Canvas, ' + ItemDrop.name_component + ',Collision, ' + selected_sprite.name)
            .attr({
                x: x - parseInt(selected_sprite.w / 2),
                y: this._height - ItemDrop.fly_drop_height - selected_sprite.h,
                z: ItemDrop.z_index_drop
            })
            .onHit('absorb', function (area, first_check) {
                if (first_check){
                    this.bind("UpdateFrame", function () {
                        if (player.x+Math.floor(player.w/2)>=this.x+Math.floor(this.w/2))
                            this.x+= ItemDrop.magnet_speed+Platforms.current_speed;
                        else
                            this.x-= ItemDrop.magnet_speed;
                        if (player.y+Math.floor(player.h/2)>=this.y+Math.floor(this.h/2))
                            this.y+= ItemDrop.magnet_speed+Platforms.current_speed;
                        else
                            this.y-= ItemDrop.magnet_speed;
                    });
                }
            })
            .onHit('player', function () {
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

    drop(other_drop_x_pos = 0) {
        let item_x;
        if (other_drop_x_pos)
            item_x = ItemDrop.calc_non_occupied_position(other_drop_x_pos, this._platforms_width);
        else
            item_x = ItemDrop.calc_middle_of_plat(this._platforms_width);
        this.set_item(item_x);
        return [item_x];


    }


}

class ItemDrop {
    static name_component = Setting.items.name_component;
    static item_types = Setting.items.dropped_items;
    static special_items = Setting.items.special_items;
    static chance_drop = Setting.items.chance_drop;
    static computer_chance = Setting.items.computer_chance;
    static buff_chance = Setting.items.buff_chance;
    static fly_drop_height = Setting.items.fly_drop_height;
    static chance_double_drop = Setting.items.chance_double_drop;
    static z_index_drop = Setting.items.z_index_drop;
    static z_index_comp = Setting.items.z_index_comp;
    static magnet_speed = Setting.items.magnet_speed;

    static get_drop(platforms_width, height) {
        if (ItemDrop.check_drop()) {
            let dropped_item = ItemDrop.get_type_of_drop();
            if (ItemDrop.check_double_drop() && platforms_width > Platforms.sprites[1].w) {
                let second_drop = ItemDrop.get_type_of_drop();
                let x_pos_first_item = (new Item(platforms_width, height, dropped_item.sprites, dropped_item.score)).drop();
                let x_pos_second_item = (new Item(platforms_width, height, second_drop.sprites, second_drop.score)).drop(x_pos_first_item);
                return [
                    x_pos_first_item,
                    x_pos_second_item
                ];
            }
            return (new Item(platforms_width, height, dropped_item.sprites, dropped_item.score)).drop();
        }
        if (ItemDrop.check_comp_drop())
            return (new Item(platforms_width, height, ItemDrop.special_items.comp.sprites)).comp_drop();
        if (ItemDrop.check_buff_drop()) {
            let dropped_buff = ItemDrop.special_items.baff_items[1];
            return (new Item(platforms_width, height, dropped_buff.sprites, 0, dropped_buff.type)).baff_drop();
        }
        return [];

    }

    static check_drop() {
        return ItemDrop.chance_drop > (getRandomInt(100) + 1)
    }

    static check_double_drop() {
        return ItemDrop.chance_double_drop > (getRandomInt(100) + 1)
    }

    static check_comp_drop() {
        return ItemDrop.computer_chance > (getRandomInt(100) + 1)
    }

    static check_buff_drop() {
        return ItemDrop.buff_chance > (getRandomInt(100) + 1)
    }

    static calc_middle_of_plat(plate_width) {
        return Platforms.level_x + parseInt(Platforms.sprites[0].w / 2) + getRandomInt(plate_width / Platforms.sprites[0].w - 1) * Platforms.sprites[0].w;

    }

    static get_type_of_drop() {
        let random_num = getRandomInt(100) + 1;
        let last_item = ItemDrop.item_types[0];
        for (let i = 0; i < ItemDrop.item_types.length; i++) {
            if (random_num <= ItemDrop.item_types[i].chance)
                return last_item;
            else
                last_item = ItemDrop.item_types[i];
        }
        return last_item;
    }

    static calc_non_occupied_position(items, platforms_width) {
        if (!Array.isArray(items)) {
            items = [items];
        }
        let non_occupied_positions = [Platforms.sprites[0].w, Platforms.sprites[1].w, Platforms.sprites[2].w, Platforms.sprites[3].w];
        non_occupied_positions.map((item, index) => {
            if (item > platforms_width)
                non_occupied_positions.splice(index, 1);
        });

        for (let item_x of items) {
            item_x -= Platforms.level_x;
            if (item_x < Platforms.sprites[0].w)
                non_occupied_positions.splice(non_occupied_positions.indexOf(Platforms.sprites[0].w), 1);
            if (item_x > Platforms.sprites[0].w && item_x < Platforms.sprites[1].w)
                non_occupied_positions.splice(non_occupied_positions.indexOf(Platforms.sprites[1].w), 1);
            if (item_x > Platforms.sprites[1].w && item_x < Platforms.sprites[2].w)
                non_occupied_positions.splice(non_occupied_positions.indexOf(Platforms.sprites[2].w), 1);
            if (item_x > Platforms.sprites[2].w)
                non_occupied_positions.splice(non_occupied_positions.indexOf(Platforms.sprites[3].w), 1);
        }
        return Platforms.level_x - Math.floor(Platforms.sprites[0].w / 2) +non_occupied_positions[getRandomInt(non_occupied_positions.length - 1)];
    }
}