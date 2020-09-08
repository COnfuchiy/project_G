/**
 * Created by Dima on 30.08.2020.
 */

class BossFight {
    static name_component = Setting.boss.name_component;
    static G_sounds = Setting.soundboard.sound.boss;
    static G_music = Setting.soundboard.music[2];
    static boss_delay = Setting.boss.boss_delay;
    static boss_available_levels = Setting.boss.boss_available_levels;
    static z_index_boss = Setting.boss.z_index_boss;
    static G = Setting.boss.boss_sprite;
    static fly_mob_delay = Setting.boss.fly_mob_delay;
    static fly_mob_speed = Setting.boss.fly_mob_speed;
    static boss_fly_speed = Setting.boss.boss_fly_speed;
    static cd_value_boss = Setting.boss.cd_value_boss;
    static boss_head_sprite = Setting.boss.boss_head_sprite;
    static boss_stages = Setting.boss.boss_stage;
    static wall_delay = Setting.boss.wall_delay;
    static pseudo_random_stages = [];
    static mob_stage_delay;
    static num_stages = 0;
    static is_hit = false;
    static boss_head = false; //if true then using fly stage
    static min_num_stage = Setting.boss.min_num_stage;


    static set_boss_fight(){
        if (BossFight.num_stages===0){
            if (!BossFight.pseudo_random_stages.length)
                BossFight.num_stages=getRandomInt(BossFight.boss_stages.length-BossFight.min_num_stage)+BossFight.min_num_stage;
            else{
                BossFight.pseudo_random_stages = [];
                is_active_spawn = true;
                current_computer_score = 0;
                $('.boss_hp_pool').detach();
                set_text(current_computer_score.toString() + '/' + total_computer_score.toString(), '.comp-score');
                Crafty.audio.stop(BossFight.G_music.name);
                play_game_audio(Setting.soundboard.music[0].name,-1,Setting.soundboard.music[0].volume);
                return;
            }

        }
        BossFight.boss_head = false;
        BossFight.num_stages--;
        let not_involved_stage = JSON.parse(JSON.stringify(BossFight.boss_stages));
        for (let stage of BossFight.pseudo_random_stages){
            if (not_involved_stage.indexOf(stage)!==-1)
                not_involved_stage.splice(not_involved_stage.indexOf(stage),1);
        }
        let random_stage = Crafty.math.randomElementOfArray(not_involved_stage);
        BossFight.pseudo_random_stages.push(random_stage);
        if (BossFight.num_stages===0 && random_stage==='shield')
            BossFight.num_stages++;
        BossFight.boss_spawn(random_stage);
    }

    static boss_spawn(stage) {
        let y_level = BossFight.boss_available_levels[getRandomInt(BossFight.boss_available_levels.length)];
        let boss_plat;
        let boss_spawn = false;
        if (!$('.boss_hp_pool')[0])
            $('body').append(`<div class="boss_hp_pool Text"></div>`);
        set_text(boss_hit_point.toString()+'/'+total_boss_hit_point.toString(), '.boss_hp_pool');
        Crafty.audio.stop(Setting.soundboard.music[0].name);
        play_game_audio(BossFight.G_sounds[3].name, 1, BossFight.G_sounds[3].volume);
        if (BossFight.pseudo_random_stages.length===1)
            play_game_audio(BossFight.G_music.name, -1, BossFight.G_music.volume);
        let boss_g = Crafty.e('2D, Canvas, Collision, ' + BossFight.name_component + ',SpriteAnimation, ' + BossFight.G.name)
            .attr({
                x: Platforms.level_x + BossFight.G.w,
                y: y_level - BossFight.G.h,
                z: BossFight.z_index_boss,
            })
            .onHit('cd', function (e) {
                if (!BossFight.boss_head){
                    e[0].obj.destroy();
                    if (!BossFight.is_hit) {
                        play_game_audio(BossFight.G_sounds[1].name, 1, BossFight.G_sounds[1].volume);
                        BossFight.is_hit = true;
                        Crafty.e("Delay").delay(() => BossFight.is_hit = false, BossFight.hit_delay);
                    }
                    boss_hit_point -= BossFight.cd_value_boss;
                    set_text(boss_hit_point.toString()+'/'+total_boss_hit_point.toString(), '.boss_hp_pool');
                    if (boss_hit_point === 0) {
                        this.destroy();
                        if (boss_plat)
                            boss_plat.destroy();
                        Crafty.trigger('Boss Death');
                    }
                }
            })
            .reel('left', BossFight.G.time, BossFight.G.reels[0])
            .animate('left', -1)
            .bind("UpdateFrame", function () {
                if (!boss_spawn) {
                    this.x = this.x - Platforms.current_speed;
                    if (this.x < Platforms.level_x - this.w) {
                        if (BossFight.pseudo_random_stages.length===1)
                            play_game_audio(BossFight.G_sounds[0].name, 1, BossFight.G_sounds[0].volume);
                        Crafty.audio.stop(BossFight.G_sounds[3].name);
                        boss_spawn = true;
                        this.pauseAnimation();
                        if (stage !== BossFight.boss_stages[4] && stage !== BossFight.boss_stages[5]){
                            BossFight.set_boss_stage(stage,y_level);
                            Crafty.e("Delay").delay(() => BossFight.boss_rollback(this, boss_plat), BossFight.boss_delay);
                        }
                           else
                            BossFight.fly_stage(boss_g, boss_plat,stage);
                    }
                }
            });
        if (y_level !== Setting.platforms.ground) {
            boss_plat = Crafty.e('2D, Canvas, Floor, ' + Platforms.sprites[2].name)
                .attr({
                    x: Platforms.level_x + Platforms.sprites[2].w,
                    y: y_level,
                    z: BossFight.z_index_boss
                })
                .bind("UpdateFrame", function () {
                    if (!boss_spawn)
                        this.x = this.x - Platforms.current_speed;
                });
            boss_g.x += boss_plat.w - boss_g.w;
        }


    }

    static set_boss_stage(stage, y_level) {
        switch (stage) {
            case BossFight.boss_stages[0]:
                let laser_pos = [Platforms.spacing_plat, y_level === Setting.platforms.ground ? 2 * Platforms.spacing_plat : Setting.platforms.ground];
                (new Monster(0, laser_pos[0], MonsterSpawn.sprite_event_monsters[2], [])).laser_beam();
                (new Monster(0, laser_pos[1], MonsterSpawn.sprite_event_monsters[2], [])).laser_beam();
                break;
            case BossFight.boss_stages[1]:
                let fly_pos = [Platforms.spacing_plat, Setting.platforms.ground];
                (new Monster(0, fly_pos[0], MonsterSpawn.sprite_event_monsters[3], [])).fly_mob(Platforms.level_x);
                (new Monster(0, fly_pos[1], MonsterSpawn.sprite_event_monsters[3], [])).fly_mob(Platforms.level_x);
                BossFight.mob_stage_delay = Crafty.e("Delay").delay(() => {
                    (new Monster(0, fly_pos[0], MonsterSpawn.sprite_event_monsters[3], [])).fly_mob(Platforms.level_x, BossFight.fly_mob_speed);
                    (new Monster(0, fly_pos[1], MonsterSpawn.sprite_event_monsters[3], [])).fly_mob(Platforms.level_x,BossFight.fly_mob_speed);
                }, BossFight.fly_mob_delay);
                break;
            case BossFight.boss_stages[2]:
                (new Monster(0, 0, MonsterSpawn.sprite_event_monsters[4], [])).laser_wall();
                break;
            case BossFight.boss_stages[3]:
                let shield = ItemDrop.special_items.baff_items[2].sprites;
                Crafty.e('2D, Canvas, ' + ItemDrop.name_component + ',Collision, ' + shield.name)
                    .attr({
                        x: Platforms.level_x,
                        y: Setting.platforms.ground - ItemDrop.fly_drop_height - shield.h,
                        z: ItemDrop.z_index_drop
                    })
                    .bind("UpdateFrame", function () {
                        this.x = this.x - Platforms.current_speed;
                        if (this.x < -this.w){
                            ItemDrop.possibility_buff = true;
                            this.destroy();
                        }
                    })
                    .onHit(Setting.player.name_component, function () {
                        this.destroy();
                        Crafty.trigger('Shield');
                    });
                BossFight.mob_stage_delay = Crafty.e("Delay").delay(() => {
                    let all_levels = Platforms.levels_y;
                    all_levels.push(Setting.platforms.ground);
                    for (let y of all_levels){
                        (new Monster(0, y, MonsterSpawn.sprite_event_monsters[2], [])).laser_beam();
                    }
                }, BossFight.wall_delay);
                break;
            case BossFight.boss_stages[4]:
                break;
            case BossFight.boss_stages[5]:
                break;

        }
    }

    static fly_stage(boss, plat, type) {
        boss.reelPosition(0);
        let boss_pos = [boss.x, boss.y];
        let direction_horizontal = false;// if true then fly right
        let direction_vertical = false;//if true then fly down
        let boss_head_back = ()=>{
            let boss_g = Crafty.e('2D, Canvas, Collision, ' + MonsterSpawn.name_component + ',SpriteAnimation, ' + BossFight.G.name)
                .attr({
                    x: boss_head.x,
                    y: boss_head.y,
                    z: BossFight.z_index_boss-1,
                })
                .reel('left', BossFight.G.time, BossFight.G.reels[0])
                .onHit('cd', function (e) {
                    if (!BossFight.boss_head){
                        e[0].obj.destroy();
                        if (!BossFight.is_hit) {
                            play_game_audio(BossFight.G_sounds[1].name, 1, BossFight.G_sounds[1].volume);
                            BossFight.is_hit = true;
                            Crafty.e("Delay").delay(() => BossFight.is_hit = false, BossFight.hit_delay);
                        }
                        boss_hit_point -= BossFight.cd_value_boss;
                        set_text(boss_hit_point.toString()+'/'+total_boss_hit_point.toString(), '.boss_hp_pool');
                        if (boss_hit_point === 0) {
                            this.destroy();
                            if (plat)
                                plat.destroy();
                            Crafty.trigger('Boss Death');
                        }
                    }
                });
            boss_head.destroy();
            BossFight.boss_head = false;
            boss.destroy();
            BossFight.boss_rollback(boss_g,plat);
        };
        let fly_way;
        switch (type){
            case BossFight.boss_stages[4]:
                fly_way = ()=>{
                    let start_down = true;
                    boss_head.bind("UpdateFrame", function () {
                        if (start_down){
                            this.y +=Platforms.current_speed;
                            if (this.y >Setting.platforms.ground-this.h)
                                start_down=false;
                        }
                        else {
                            if (!direction_horizontal) {
                                if (this.x > 0)
                                    this.x = this.x - BossFight.boss_fly_speed.x;
                                if (!direction_vertical){
                                    if (this.y > 0)
                                        this.y = this.y - BossFight.boss_fly_speed.y;
                                    else
                                        direction_vertical = true;
                                }
                                else{
                                    if (this.y + this.h<Setting.platforms.ground)
                                        this.y = this.y + BossFight.boss_fly_speed.y;
                                    else
                                        direction_vertical = false;
                                }
                                if (this.x < 0)
                                    direction_horizontal = true
                            }
                            else {
                                if (this.x < boss_pos[0])
                                    this.x = this.x + BossFight.boss_fly_speed.x;
                                if (this.y !== boss_pos[1]){
                                    if (this.y < boss_pos[1])
                                        this.y = this.y + BossFight.boss_fly_speed.y;
                                    else
                                        this.y = this.y - BossFight.boss_fly_speed.y;
                                }
                                if (this.x >= boss_pos[0] && this.y >= boss_pos[1]) {
                                    boss_head_back();
                                }
                            }
                        }
                    });
                };
                break;
            case BossFight.boss_stages[5]:
                fly_way = ()=>{
                    let start_up = true;
                    boss_head.bind("UpdateFrame", function () {
                        if (start_up){
                            this.y -=Platforms.current_speed;
                            if (this.y <0)
                                start_up=false;
                        }
                        else {
                            if (!direction_horizontal) {
                                if (this.x > 0)
                                    this.x = this.x - BossFight.boss_fly_speed.x;
                                if (!direction_vertical){
                                    if (this.y > 0)
                                        this.y = this.y - BossFight.boss_fly_speed.y;
                                    else
                                        direction_vertical = true;
                                }
                                else{
                                    if (this.y + this.h<Setting.platforms.ground)
                                        this.y = this.y + BossFight.boss_fly_speed.y;
                                    else
                                        direction_vertical = false;
                                }
                                if (this.x < 0)
                                    direction_horizontal = true
                            }
                            else {
                                if (this.x < boss_pos[0])
                                    this.x = this.x + BossFight.boss_fly_speed.x;
                                if (this.y !== boss_pos[1]){
                                    if (this.y < boss_pos[1])
                                        this.y = this.y + BossFight.boss_fly_speed.y;
                                    else
                                        this.y = this.y - BossFight.boss_fly_speed.y;
                                }
                                if (this.x >= boss_pos[0] && this.y >= boss_pos[1]) {
                                    boss_head_back();
                                }
                            }
                        }
                    });
                };
                break;
        }
        let boss_head = Crafty.e('2D, Canvas, Collision, ' + BossFight.name_component + ',SpriteAnimation, '+BossFight.boss_head_sprite.name)
            .attr({
                x: boss.x,
                y: boss.y,
                z: BossFight.z_index_boss,
            })
            .onHit('cd', function (e) {
                    e[0].obj.destroy();
                    if (!BossFight.is_hit) {
                        play_game_audio(BossFight.G_sounds[1].name, 1, BossFight.G_sounds[1].volume);
                        BossFight.is_hit = true;
                        Crafty.e("Delay").delay(() => BossFight.is_hit = false, BossFight.hit_delay);
                    }
                    boss_hit_point -= BossFight.cd_value_boss;
                    set_text(boss_hit_point.toString()+'/'+total_boss_hit_point.toString(), '.boss_hp_pool');
                    if (boss_hit_point === 0) {
                        BossFight.boss_head = false;
                        this.destroy();
                        boss.destroy();
                        if (plat)
                            plat.destroy();
                        Crafty.trigger('Boss Death');
                    }

            });
        BossFight.boss_head= true;
        fly_way();
        boss.crop(0, BossFight.boss_head_sprite.h+3, BossFight.G.h, BossFight.G.h-BossFight.boss_head_sprite.h);
        boss.y += BossFight.boss_head_sprite.h+3;
    }

    static boss_rollback(boss, boss_plat){
        boss.animate('left', -1);
        play_game_audio(BossFight.G_sounds[3].name, 1, BossFight.G_sounds[3].volume);
        if (BossFight.num_stages===0)
            play_game_audio(BossFight.G_sounds[2].name, 1, BossFight.G_sounds[2].volume);
        boss.bind('UpdateFrame', function () {
            this.x = this.x + Platforms.current_speed;
            if (this.x > Platforms.level_x + this.w) {
                this.destroy();
                Crafty.audio.stop(BossFight.G_sounds[3].name);
                BossFight.set_boss_fight();
            }
        });
        if (boss_plat !== undefined) {
            boss_plat.bind('UpdateFrame', function () {
                this.x = this.x + Platforms.current_speed;
                if (this.x > Platforms.level_x + this.w)
                    this.destroy();
            });
        }
    }

}