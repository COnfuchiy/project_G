/**
 * Created by Dima on 05.08.2020.
 */
//functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function setText(inputX, inputY, textString, cStyles) {
    let tempText = Crafty.e('2D, DOM, Text')
        .attr({
            x: inputX,
            y: inputY
        });
    tempText.textFont(cStyles);
    tempText.text(textString);
    return tempText;
}
function set_background() {
    for (let i = 0; i < Setting.screen.fon_number; i++) {
        Crafty.e('2D, Canvas, fon')
            .attr({x: Setting.screen.fon_width * i, y: 0, z: Setting.screen.fon_z_index})
            .bind('UpdateFrame', function () {
                this.x = this.x - Setting.screen.fon_speed;
                if (this.x + this.w === -Setting.screen.fon_speed)
                    this.x = (Setting.screen.fon_width - 1) * (Setting.screen.fon_number - 1);
            });
    }
}
function set_cd_exchanger_daley() {
    let middle_in_sec = (Setting.game.cd_exchanger_max_delay - Setting.game.cd_exchanger_min_delay) / Setting.game.cd_exchanger_delay_step;
    return Setting.game.cd_exchanger_min_delay + getRandomInt(middle_in_sec) * Setting.game.cd_exchanger_delay_step;
}
function spawn_cd_exchanger() {
    Crafty.e('2D, Canvas, cd_exchanger, Collision')
        .attr({x: Platforms.level_x, y: 450})
        .bind("UpdateFrame", function () {
            this.x = this.x - Platforms.current_speed;
            if (this.x < -this.w)
                this.destroy();
        })
        .onHit(Setting.player.name_component, function (item, first_check) {
            if (first_check && user_score > Setting.game.cd_cost){
                Crafty.audio.play(Setting.soundboard.sound.player[2].name,1,Setting.soundboard.sound.player[2].volume);
                while (user_score >= Setting.game.cd_cost) {
                    user_score -= Setting.game.cd_cost;
                    user_num_cd++;
                }
                cd_num_text.text(':' + user_num_cd.toString());
                user_score_text.text(user_score.toString());
            }
        });
}
function cd_exchanger_loop(delay) {
    if (is_active_spawn) {
        cd_exchanger = Crafty.e("Delay").delay(function () {
            spawn_cd_exchanger();
            cd_exchanger_loop(set_cd_exchanger_daley());
        }, delay);

    }
}
function cd_shoot() {
    if (Crafty.stage.elem.style.background !== "rgb(0, 0, 0)") {//check death screen
        if (user_num_cd) {
            Crafty.audio.play(Setting.soundboard.sound.player[0].name,1,Setting.soundboard.sound.player[0].volume);
            user_num_cd--;
            cd_num_text.text(':'+user_num_cd.toString());
            Crafty.e('2D, Canvas, Collision, cd')
                .attr({
                    x: player.x + Math.floor(player.h / 2),
                    y: player.y + Math.floor(player.w / 2),
                    z: Setting.player.cd_z_index
                })
                .bind("UpdateFrame", function () {
                    this.x = this.x + Setting.player.cd_speed;
                    if (this.x > Platforms.level_x)
                        this.destroy();
                });
        }

    }
}
function set_buff_timer(sprite, del_callback) {
    let buff_time = Setting.items.buff_time;
    let timer_img = Crafty.e('2D, Canvas, ' + sprite.name)
        .attr({
            x: 0,
            y: 580
        });
    let timer_num = setText(Math.floor(sprite.w * Setting.screen.scale) + 10, Math.floor(580 * Setting.screen.scale), (buff_time / 1000).toString(), {
        size: '50px',
        weight: 'bold'
    });
    let timer = Crafty.e("Delay").delay(() => {
        if (buff_time === 0) {
            del_callback();
            timer_img.destroy();
            timer_num.destroy();
            ItemDrop.possibility_buff = true;
            timer.destroy();
        }
        else {
            buff_time -= 1000;
            timer_num.text(buff_time / 1000).toString();
        }
    }, 1000,-1);
}

//global variable
let user_score = 0;
let cd_exchanger;
let current_computer_score = 0;
let special_mob_counter = 0;
let total_computer_score = Setting.game.start_num_comp;
let user_num_cd = 0;
let is_active_spawn = true;
let boss_hit_point = 100;
let current_increase_score = 1;
let player;
let boss_hp_text;
let cd_num_text;
let user_score_text;
let comp_score_text;
//global events
Crafty.bind('Death', function () {
    if (!Crafty('shield').get(0)) {
        Crafty.enterScene('Death Screen');

    }
});
Crafty.bind('Boss', function () {
    is_active_spawn = false;
    cd_exchanger.destroy();
    cd_exchanger_loop(set_cd_exchanger_daley());
    BossFight.set_boss_fight();
});
Crafty.bind('Boss Death', function () {
    is_active_spawn = true;
    current_computer_score = 0;
    total_computer_score += Setting.game.increase_num_comp;
    comp_score_text.text(current_computer_score.toString() + '/' + total_computer_score.toString());
    boss_hp_text.destroy();
    boss_hit_point = 100;
});
Crafty.bind('Shield', function () {
    Crafty.audio.play(Setting.soundboard.sound.player[1].name,1,Setting.soundboard.sound.player[1].volume);
    Crafty.audio.play(Setting.soundboard.sound.player[4].name,1,Setting.soundboard.sound.player[4].volume);
    let shield = Crafty.e('2D, Canvas, shield')
        .attr(
            {
                x: player.x - Math.floor((Setting.player.buff_effect_sprites[1].w - player.w) / 2),
                y: player.y - Math.floor((Setting.player.buff_effect_sprites[1].h - player.h) / 2),
                z: Setting.player.z_index,
            }
        )
        .bind("UpdateFrame", function () {
            this.x = player.x - Math.floor((Setting.player.buff_effect_sprites[1].w - player.w) / 2);
            this.y = player.y - Math.floor((Setting.player.buff_effect_sprites[1].h - player.h) / 2);
        });
    set_buff_timer(Setting.items.special_items.baff_items[2].sprites, () => {
        shield.destroy();
        Crafty.audio.stop(Setting.soundboard.sound.player[4].name);
    });
});
Crafty.bind('Magnet', function () {
    Crafty.audio.play(Setting.soundboard.sound.player[3].name,-1,Setting.soundboard.sound.player[3].volume);
    let absorb_field = Crafty.e('2D, Canvas, Collision, absorb')
        .attr(
            {
                x: player.x - Setting.items.magnet_area,
                y: player.y - Setting.items.magnet_area,
                h: Setting.items.magnet_area * 2 + player.h,
                w: Setting.items.magnet_area * 2 + player.w,
            }
        )
        .bind("UpdateFrame", function () {
            this.x = player.x - Setting.items.magnet_area;
            this.y = player.y - Setting.items.magnet_area;
        });
    let magnet = Crafty.e('2D, Canvas, magnet')
        .attr(
            {
                x: player.x + Math.floor((Setting.player.buff_effect_sprites[0].w - player.w) / 2),
                y: player.y + Math.floor((Setting.player.buff_effect_sprites[0].h - player.h) / 2),
                z: Setting.player.z_index,
            }
        )
        .bind("UpdateFrame", function () {
            this.x = player.x + Math.floor((Setting.player.buff_effect_sprites[0].w - player.w) / 2);
            this.y = player.y + Math.floor((Setting.player.buff_effect_sprites[0].h - player.h) / 2);
        });
    set_buff_timer(Setting.items.special_items.baff_items[1].sprites, () => {
        Crafty.audio.stop(Setting.soundboard.sound.player[3].name);
        absorb_field.destroy();
        magnet.destroy();
    });
});
Crafty.bind('Increase', function () {
    Crafty.audio.play(Setting.soundboard.sound.player[5].name,1,Setting.soundboard.sound.player[5].volume);
    current_increase_score = Setting.items.increase_multiplier;
    set_buff_timer(Setting.items.special_items.baff_items[0].sprites, () => {
        current_increase_score = 1;
    });
});
//pc spawn


