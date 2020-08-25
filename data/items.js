/**
 * Created by Dima on 17.08.2020.
 */

class Item {
    constructor(platforms_width, height, sprites, score = 0) {
        this._platforms_width = platforms_width;
        this._height = height;
        this._sprites = sprites;
        this._score = score;
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
                z:ItemDrop.z_index_comp
            })
            .onHit('player', function () {
                if (this[0] !== twice_check) {
                    twice_check = this[0];
                    current_computer_score++;
                    comp_score_text.text(current_computer_score.toString() + '/'+total_computer_score);
                    if (current_computer_score === total_computer_score) {
                        Crafty.trigger('Boss');
                        current_computer_score = 0;
                        comp_score_text.text(current_computer_score.toString() + '/'+total_computer_score);
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
        let selected_sprite = Array.isArray(this._sprites) ? this._sprites[getRandomInt(this._sprites.length)] : this._sprites;
        Crafty.e('2D, Canvas, Collision,' + selected_sprite.name)
            .attr({
                x: x - parseInt(selected_sprite.w / 2),
                y: this._height - ItemDrop.fly_drop_height - selected_sprite.h,
                z:ItemDrop.z_index_drop
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

    drop() {
        if ((getRandomInt(100) + 1) >=ItemDrop.chance_double_drop && this._platforms_width > Platforms.sprites[1].w) {
            let first_item = ItemDrop.calc_middle_of_plat(this._platforms_width);
            let second_item = 0;
            if (first_item > Platforms.sprites[2].w) {
                second_item =  Platforms.level_x + parseInt(Platforms.sprites[0].w / 2) + getRandomInt(1) * Platforms.sprites[0].w;
            }
            else {
                if (this._platforms_width === Platforms.sprites[2].w)
                    second_item = Platforms.level_x + parseInt(Platforms.sprites[0].w / 2) + 2 * Platforms.sprites[0].w;
                else
                    second_item = Platforms.level_x + parseInt(Platforms.sprites[0].w / 2) + 2 * Platforms.sprites[0].w +getRandomInt(1) * Platforms.sprites[0].w;
            }
            this.set_item(first_item);
            this.set_item(second_item);
            return [first_item, second_item];
        } else {
            let item_x = ItemDrop.calc_middle_of_plat(this._platforms_width);
            this.set_item(item_x);
            return [item_x];
        }

    }


}

class ItemDrop {
    static item_types = Setting.items.dropped_items;
    static special_items = Setting.items.special_items;
    static chance_drop = Setting.items.chance_drop;
    static computer_chance = Setting.items.computer_chance;
    static fly_drop_height = Setting.items.fly_drop_height;
    static chance_double_drop = Setting.items.chance_double_drop;
    static z_index_drop = Setting.items.z_index_drop;
    static z_index_comp = Setting.items.z_index_comp;

    static get_drop(platforms_width, height) {
        if (ItemDrop.check_drop()) {
            let dropped_item = ItemDrop.get_type_of_drop();
            return (new Item(platforms_width, height, dropped_item.sprites, dropped_item.score)).drop();
        }
        else {
            if (ItemDrop.check_comp_drop())
                return (new Item(platforms_width, height, ItemDrop.special_items.comp.sprites)).comp_drop();
        }
        return [];

    }

    static check_drop() {
        return ItemDrop.chance_drop > (getRandomInt(100) + 1)
    }

    static check_comp_drop() {
        return ItemDrop.computer_chance > (getRandomInt(100) + 1)
    }

    static calc_middle_of_plat(plate_width){
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
    }
}