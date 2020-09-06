/**
 * Created by Dima on 05.08.2020.
 */
//functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function set_text(text, element) {
    $(element)[0].innerText = text;
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
            if (first_check && user_score > Setting.game.cd_cost) {
                play_game_audio(Setting.soundboard.sound.player[2].name, 1, Setting.soundboard.sound.player[2].volume);
                while (user_score >= Setting.game.cd_cost) {
                    user_score -= Setting.game.cd_cost;
                    user_num_cd++;
                }
                set_text(':' + user_num_cd.toString(),'.cd-text');
                set_text('Score:'+user_score.toString(), '.main-score');
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
            play_game_audio(Setting.soundboard.sound.player[0].name, 1, Setting.soundboard.sound.player[0].volume);
            user_num_cd--;
            set_text(':' + user_num_cd.toString(),'.cd-text');
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
function clear_death_data() {
    Platforms.platforms_levels = [];
    MonsterSpawn.pseudo_random_events = [];
    ItemDrop.possibility_buff = true;
    ItemDrop.last_buff_item = undefined;
    BossFight.pseudo_random_stages = [];
    BossFight.num_stages = 0;
    BossFight.is_hit = false;
    BossFight.boss_head = false;
    user_score = 0;
    current_computer_score = 0;
    special_mob_counter = 0;
    total_computer_score = Setting.game.start_num_comp;
    user_num_cd = 0;
    is_active_spawn = true;
    boss_hit_point = 100;
    current_increase_score = 0;
    boss_hp_text = undefined;
    cd_num_text = undefined;
    user_score_text = undefined;
    comp_score_text = undefined;
}
function create_score_tab() {
    $('body').append(`
                    <table class="info_table">
                        <tr>
                            <td class="comp-score Text"></td>
                            <td class="main-score Text"></td>
                            <td class="cd-num ">
                                <div class="cd-img">
                                
                                </div>
                                <div class="cd-text Text">
                                
                                </div>
                            </td>
                        </tr>
                    </table>`);
}
function set_buff_timer(sprite, del_callback) {
    let buff_time = Setting.items.buff_time;
    $('body').append(`
                    <table class="baff_table">
                        <tr>
                            <td class="baff-item">
                                <div class="baff-img" style="background:`+'url(./sprites/items/'+sprite.name+'.png) no-repeat'+`"></div>
                            </td>
                            <td class="timer Text"></td>
                        </tr>
                    </table>`);
    set_text(':'+(buff_time / 1000).toString(),'.timer');
    let timer = Crafty.e("Delay").delay(() => {
        buff_time -= 1000;
        if (buff_time === 0) {
            del_callback();
            $('.baff_table').detach();
            ItemDrop.possibility_buff = true;
            timer.destroy();
        }
        else
            set_text(':'+(buff_time / 1000).toString(),'.timer');
    }, 1000, -1);
}
function play_game_audio(sound_name, delay = 1, volume = 1) {
    if (is_audio)
        Crafty.audio.play(sound_name, delay, volume);
}
function stop_music() {
    if (is_audio) {
        Crafty.audio.pause(Setting.soundboard.music[3].name, -1, Setting.soundboard.music[3].vol);
        is_audio = false;
    }
    else {
        Crafty.audio.unpause(Setting.soundboard.music[3].name);
        is_audio = true;
    }

}
//global variable
let is_audio = true;
let is_pause;
let user_score = 0;
let cd_exchanger;
let current_computer_score = 0;
let special_mob_counter = 0;
let total_computer_score = Setting.game.start_num_comp;
let user_num_cd = 0;
let is_active_spawn = true;
let total_boss_hit_point = 100;
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
    BossFight.pseudo_random_stages = [];
    if (BossFight.mob_stage_delay)
        BossFight.mob_stage_delay.destroy();
    Crafty.audio.stop(BossFight.G_music.name);
    play_game_audio(Setting.soundboard.music[0].name,-1,Setting.soundboard.music[0].volume);
    user_score += Math.floor(Setting.game.cd_cost*(100/Setting.boss.cd_value_boss));
    set_text('Score:'+user_score.toString(), '.main-score');
    is_active_spawn = true;
    current_computer_score = 0;
    total_computer_score += Setting.game.increase_num_comp;
    set_text('0/'+total_computer_score.toString(), '.comp-score');
    $('.boss_hp_pool').detach();
    boss_hit_point = 100;
});
Crafty.bind('Shield', function () {
    play_game_audio(Setting.soundboard.sound.player[1].name, 1, Setting.soundboard.sound.player[1].volume);
    play_game_audio(Setting.soundboard.sound.player[4].name, 1, Setting.soundboard.sound.player[4].volume);
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
    play_game_audio(Setting.soundboard.sound.player[3].name, -1, Setting.soundboard.sound.player[3].volume);
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
    play_game_audio(Setting.soundboard.sound.player[5].name, 1, Setting.soundboard.sound.player[5].volume);
    current_increase_score = Setting.items.increase_multiplier;
    set_buff_timer(Setting.items.special_items.baff_items[0].sprites, () => {
        current_increase_score = 1;
    });
});



