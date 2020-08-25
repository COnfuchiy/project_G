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
    for (let i = 0; i<Setting.screen.fon_number;i++){
        Crafty.e('2D, Canvas, fon')
            .attr({x: Setting.screen.fon_width*i, y: 0,z:Setting.screen.fon_z_index})
            .bind('UpdateFrame',function () {
                this.x = this.x - Setting.screen.fon_speed;
                if (this.x+this.w===-Setting.screen.fon_speed)
                    this.x = (Setting.screen.fon_width-1)*(Setting.screen.fon_number-1);
            });
    }
}
function set_cd_exchanger_daley() {
    let middle_in_sec = (Setting.game.cd_exchanger_max_delay - Setting.game.cd_exchanger_min_delay)/Setting.game.cd_exchanger_delay_step;
    return Setting.game.cd_exchanger_min_delay + getRandomInt(middle_in_sec) * Setting.game.cd_exchanger_delay_step;
}
function spawn_cd_exchanger() {
    if (is_active_spawn){
        setTimeout(function () {
            Crafty.e('2D, Canvas, cd_exchanger, Collision')
                .attr({x: Platforms.level_x, y: 450})
                .bind("UpdateFrame", function () {
                    this.x = this.x - Platforms.current_speed;
                    if (this.x < -this.w)
                        this.destroy();
                })
                .onHit('player', function (e) {
                    while (user_score >= 500) {
                        user_score -= 500;
                        user_num_cd++;
                    }
                    cd_num_text.text(':' + user_num_cd.toString());
                    user_score_text.text(user_score.toString());
                });
            spawn_cd_exchanger();
        }, set_cd_exchanger_daley());

    }
}
function cd_shoot() {
    Crafty.e('2D, Canvas, Collision, cd')
        .attr({x:player.x+Math.floor(player.h/2), y:player.y+Math.floor(player.w/2)})
        .bind("UpdateFrame", function () {
            this.x = this.x + Setting.player.cd_speed;
            if (this.x > Platforms.level_x)
                this.destroy();
        });
}
set_background();
//global variable
let user_score = 0;
let current_computer_score = 0;
let special_mob_counter = 0;
let total_computer_score = Setting.game.start_num_comp;
let user_num_cd = 0;
let is_active_spawn = true;
let boss_hit_point = 100;
//set floor
Crafty.e('2D, Canvas, Floor')
    .attr({x: 0, y: Setting.platforms.ground, w: Platforms.level_x, h: 20});
//global events
Crafty.bind('Death', function () {
    if (confirm("You Died"))
    {
        player.destroy();
        location.reload();
    }
});
Crafty.bind('Boss', function () {
    is_active_spawn = false;
    MonsterSpawn.boss_spawn();
});
//pc spawn

spawn_cd_exchanger(set_cd_exchanger_daley());
//set scale
Crafty.viewport.scale(Setting.screen.scale);
// cd pic
Crafty.e('2D, Canvas, cd').attr({x: 450, y: 525});
//view boss hp
let boss_hp_text;
// cd score number
let cd_num_text = setText(790, 780, ':' + user_num_cd.toString(), {size: '50px', weight: 'bold'});
// score field
setText(300, 780, 'Score:', {size: '50px', weight: 'bold'});
// user score number
let user_score_text = setText(500, 780, user_score.toString(), {size: '50px', weight: 'bold'});
// comp score number
let comp_score_text = setText(100, 780, '0/10', {size: '50px', weight: 'bold'});
//game left move
Platforms.loop();
