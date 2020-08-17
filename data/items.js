/**
 * Created by Dima on 17.08.2020.
 */

class Item{
    constructor(type, platforms_width,height, sprite,score, color){
        this._type = type;
        this._platforms_width = platforms_width;
        this._height = height;
        this._sprites = sprite;
        this._score = score;
        this._att_name = 'GEN_item';
        this._color = color;
        return this;
    }
    set_item(x){
        let item_score = this._score;
        Crafty.e('2D, Canvas, Collision, Color,'+this._att_name)
            .attr({
                x: x,
                y: this._height-40,
                w:20,
                h:20
            })
            .color(this._color)
            .onHit('player',function(e) {
                user_score+=item_score;
                user_score_text.text(user_score.toString());
                this.destroy();
            })
            .bind("UpdateFrame", function () {
                this.x = this.x - Platforms.current_speed;
                if (this.x < -this.w)
                    this.destroy();
            });
    }
    drop(){
        if (getRandomInt(99)+1>=85 && this._platforms_width>180){
            // double drop
            let first_item = this.calc_x_drop();
            let second_item = 0;
            if (first_item>267){
                second_item = Platforms.level_x+45-10+getRandomInt(1)*90;
            }
            else{
                if (this._platforms_width===267)
                    second_item = Platforms.level_x+45-10+180;
                else
                    second_item = Platforms.level_x+45-10+180+getRandomInt(1)*90;
            }
            this.set_item(first_item);
            this.set_item(second_item);
        }else{
            let item_x = this.calc_x_drop();
            this.set_item(item_x);
        }

    }
    calc_x_drop(){
        switch (this._platforms_width){
            case 93:
                return Platforms.level_x+47-10;
            case 180:
                return Platforms.level_x+45-10+getRandomInt(1)*90;
            case 267:
                return Platforms.level_x+45-10+getRandomInt(2)*90;
            case 354:
                return Platforms.level_x+45-10+getRandomInt(3)*90;
        }

    }

}

class ItemDrop{
    static item_types = [
        {
            color:'#ffd200',
            score:100,
            chance:15,
        },
        {
            color:'#0002ff',
            score:200,
            chance:30,
        },
        {
            color:'#aa5661',
            score:300,
            chance:45,
        },
        {
            color:'#53346e',
            score:400,
            chance:60,
        },
        {
            color:'#ff3200',
            score:500,
            chance:75,
        },
        {
            color:'#aa5661',
            score:600,
            chance:90,
        },
        {
            color:'#c4bfb2',
            score:700,
            chance:95,
        },
        {
            color:'#388533',
            score:800,
            chance:100,
        },

    ];
    static chance_drop = 80;

    static get_drop(platforms_width,height){
        if (ItemDrop.check_drop()){
            let dropped_item = ItemDrop.get_type_of_drop();
            (new Item(1,platforms_width,height,1,dropped_item.score,dropped_item.color)).drop();
        }
    }
    static check_drop(){
        return ItemDrop.chance_drop > (getRandomInt(99)+1)
    }
    static get_type_of_drop(){
        let random_num = getRandomInt(99)+1;
        let last_item = ItemDrop.item_types[0];
        for (let i=0;i<ItemDrop.item_types.length;i++){
            if (random_num<=ItemDrop.item_types[i].chance)
                return last_item;
            else
                last_item = ItemDrop.item_types[i];
        }
    }
}