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

    walking_mob(x) {
        x -= MonsterSpawn.walk_monsters_start_pos;
        let animate_counter = 0;
        let animate_speed = 0;
        let mob_life = MonsterSpawn.mob_num_life.sort_walking;
        Crafty.e('2D, Canvas, Collision,'+MonsterSpawn.name_component+',SpriteAnimation, ' + this._sprites.name)
            .attr({
                x: x + this._sprites.w,
                y: this._height - this._sprites.h,
                z: MonsterSpawn.z_index_mobs.sort_walking,
            })
            .onHit('cd', function (e) {
                e[0].obj.destroy();
                mob_life--;
                if (mob_life === 0) {
                    user_score += MonsterSpawn.destroy_score;
                    user_score_text.text(user_score.toString());
                    this.destroy();
                }
            })
            .reel('back', this._sprites.time, this._sprites.reels[1])
            .reel('ahead', this._sprites.time, this._sprites.reels[0])
            .bind("UpdateFrame", function () {
                if (this.x < Platforms.level_x) {
                    if (!animate_speed) {
                        animate_speed = MonsterSpawn.walking_speed;
                        this.animate('ahead', -1);
                    }
                    animate_counter++;
                    if (animate_counter > MonsterSpawn.walk_monsters_time && !this.isPlaying('back')) {
                        animate_speed = -MonsterSpawn.walking_speed;
                        this.animate('back', -1);
                    }
                    if (animate_counter > 2 * MonsterSpawn.walk_monsters_time) {
                        animate_counter = 0;
                        animate_speed = 0;
                    }
                }
                this.x = this.x - Platforms.current_speed - animate_speed;
                if (this.x < -this.w)
                    this.destroy();
            });
    }

    left_mob(x) {
        let mob_life = MonsterSpawn.mob_num_life.left_walking;
        Crafty.e('2D, Canvas, Collision, SpriteAnimation, Gravity, '+MonsterSpawn.name_component+', Jumper, ' + this._sprites.name)
            .attr({
                x: x + this._sprites.w,
                y: this._height - this._sprites.h,
                z: MonsterSpawn.z_index_mobs.left_walking,
            })
            .gravity(Platforms.component_for_mob)
            .gravityConst(Setting.game.gravity_const)
            .jumpSpeed(MonsterSpawn.left_walking_jump_speed)
            .onHit('cd', function (e) {
                e[0].obj.destroy();
                mob_life--;
                if (mob_life === 0) {
                    user_score += MonsterSpawn.destroy_score;
                    user_score_text.text(user_score.toString());
                    this.destroy();
                }
            })
            .reel('left', this._sprites.time, this._sprites.reels[0])
            .animate('left', -1)
            .bind("UpdateFrame", function () {
                this.x = this.x - Platforms.current_speed - MonsterSpawn.walking_speed;
                if (this.x < -this.w)
                    this.destroy();
            })
            .bind("CheckJumping", function (ground) {
                if (!ground && this.y > 100)
                    this.canJump = true;
            })
            .bind('LiftedOffGround', function () {
                this.jump();
            });
    }

    laser_beam() {
        let shoot_check = false;
        Crafty.e('2D, Canvas, Collision, SpriteAnimation, ' + this._sprites.name)
            .attr({
                x: Platforms.level_x + 50 - this._sprites.w,
                y: this._height - this._sprites.h,
                z: MonsterSpawn.z_index_mobs.laser,
            })
            .reel('before', this._sprites.time, this._sprites.reels[0])
            .reel('after', this._sprites.time, this._sprites.reels[1])
            .bind("UpdateFrame", function () {
                if (this.x <= Platforms.level_x - this.w) {
                    if (!shoot_check) {
                        shoot_check = true;
                        Crafty.e("Delay").delay(() => {
                            this.animate('before');
                        }, MonsterSpawn.laser_delay);
                    }
                }
                else {
                    this.x = this.x - Platforms.current_speed - MonsterSpawn.walking_speed;
                }
            })
            .bind('AnimationEnd', function (e) {
                if (e.id==='after')
                    this.destroy();
                else{
                    this.addComponent(MonsterSpawn.name_component);
                    this.onHit(MonsterSpawn.name_component, function (e) {
                        e[0].obj.destroy();
                    });
                    this.onHit(Setting.items.name_component, function (e) {
                        e[0].obj.destroy();
                    });
                    this.animate('after');
                }

            });

    }

    fly_mob(x) {
        let direction = true; //true as up
        let mob_life = MonsterSpawn.mob_num_life.fly;
        Crafty.e('2D, Canvas, Collision,'+MonsterSpawn.name_component+',SpriteAnimation, ' + this._sprites.name)
            .attr({
                x: x + this._sprites.w,
                y: this._height - this._sprites.h,
                z: MonsterSpawn.z_index_mobs.fly,
            })
            .onHit('cd', function (e) {
                e[0].obj.destroy();
                mob_life--;
                if (mob_life === 0) {
                    user_score += MonsterSpawn.destroy_score;
                    user_score_text.text(user_score.toString());
                    this.destroy();
                }
            })
            .reel('fly', this._sprites.time, this._sprites.reels[0])
            .animate('fly', -1)
            .bind("UpdateFrame", function () {
                if (direction) {
                    this.y -= MonsterSpawn.fly_mob_y_speed;
                    if (this.y === 0)
                        direction = false;
                }
                else {
                    this.y += MonsterSpawn.fly_mob_y_speed;
                    if (this.y + this.h === Setting.platforms.ground)
                        direction = true;
                }
                this.x = this.x - Platforms.current_speed;

            })

    }

    set_mob(x) {
        switch (this._sprites.type) {
            case 'sort_walking':
                this.walking_mob(x);
                return;
            case 'left_walking':
                this.left_mob(x);
                return;
            case 'laser':
                this.laser_beam(x);
                return;
            case 'fly':
                this.fly_mob(x);
                return;
        }


    }

    spawn() {
        if (!this._items.length) {
            let mob_x = ItemDrop.calc_middle_of_plat(this._platforms_width);
            this.set_mob(mob_x);
        }
        else {
            if (this._items.length === 1 && this._platforms_width === Platforms.sprites[0].w)
                return;
            if (this._items.length === 2 && this._platforms_width === Platforms.sprites[1].w)
                return;

            let mob_x = ItemDrop.calc_non_occupied_position(this._items,this._platforms_width);
            this.set_mob(mob_x);
        }
    }
}

class MonsterSpawn {
    static name_component = Setting.mobs.name_component;
    static sprite_walk_monsters = Setting.mobs.walk_monsters_sprites;
    static sprite_event_monsters = Setting.mobs.event_monsters_sprites;
    static walk_monsters_start_pos = Setting.mobs.walk_monsters_start_pos;
    static walk_monsters_time = Setting.mobs.walk_monsters_time;
    static left_walking_jump_speed = Setting.mobs.left_walking_jump_speed;
    static laser_delay = Setting.mobs.laser_delay;
    static fly_mob_y_speed = Setting.mobs.fly_mob_y_speed;
    static G = Setting.mobs.boss_sprite;
    static walking_speed = Setting.mobs.walking_speed;
    static destroy_score = Setting.mobs.destroy_score;
    static chance_spawn = Setting.mobs.chance_spawn;
    static event_counter = Setting.mobs.event_counter;
    static z_index_mobs = Setting.mobs.z_index_mobs;
    static z_index_boss = Setting.mobs.z_index_boss;
    static cd_value_boss = Setting.game.cd_value_boss;
    static boss_delay = Setting.game.boss_delay;
    static boss_available_levels = Setting.mobs.boss_available_levels;
    static mob_num_life = Setting.mobs.mob_num_life;
    static pseudo_random_events = [];

    static get_spawn(platforms_width, height, items) {
        if (MonsterSpawn.check_spawn()) {
            if (special_mob_counter === MonsterSpawn.event_counter) {
                special_mob_counter = 0;
                (new Monster(platforms_width, height, MonsterSpawn.get_event_mob_sprite(), items)).spawn();
            }
            else {
                special_mob_counter++;
                (new Monster(platforms_width, height,
                    MonsterSpawn.sprite_walk_monsters[getRandomInt(MonsterSpawn.sprite_walk_monsters.length)], items)).spawn();
            }
        }
    }

    static check_spawn() {
        return MonsterSpawn.chance_spawn > (getRandomInt(100) + 1)
    }

    static boss_spawn() {
        let level_y = MonsterSpawn.boss_available_levels[getRandomInt(MonsterSpawn.boss_available_levels.length)];
        let laser_pos = MonsterSpawn.calc_y_laser(level_y);
        let boss_plat;
        let boss_g = Crafty.e('2D, Canvas, Collision, '+MonsterSpawn.name_component+',SpriteAnimation, ' + MonsterSpawn.G.name)
            .attr({
                x: Platforms.level_x + MonsterSpawn.G.w,
                y: level_y - MonsterSpawn.G.h,
                z: MonsterSpawn.z_index_boss,
            })
            .onHit('cd', function (e) {
                e[0].obj.destroy();
                boss_hit_point -= MonsterSpawn.cd_value_boss;
                boss_hp_text.text(boss_hit_point.toString() + '/100');
                if (boss_hit_point === 0) {
                    total_computer_score += Setting.game.increase_num_comp;
                    comp_score_text.text(current_computer_score.toString() + '/' + total_computer_score);
                    boss_hp_text.destroy();
                    this.destroy();
                    boss_hit_point = 100;
                }

            })
            .reel('left', MonsterSpawn.G.time, MonsterSpawn.G.reels[0])
            .animate('left', -1)
            .bind("UpdateFrame", function () {
                if (!is_active_spawn) {
                    this.x = this.x - Platforms.current_speed;
                    if (this.x < Platforms.level_x - this.w) {
                        is_active_spawn = true;
                        boss_hp_text = setText(document.documentElement.clientWidth / 2, 50, boss_hit_point.toString() + '/100', {
                            size: '50px',
                            weight: 'bold'
                        });
                        this.pauseAnimation();
                        (new Monster(93, laser_pos[0], MonsterSpawn.sprite_event_monsters[2], [])).spawn();
                        (new Monster(93, laser_pos[1], MonsterSpawn.sprite_event_monsters[2], [])).spawn();
                        Crafty.e("Delay").delay(() => {
                            this.animate('left', -1);
                            this.bind('UpdateFrame', function () {
                                this.x = this.x + Platforms.current_speed;
                                if (this.x > Platforms.level_x + this.w) {
                                    boss_hp_text.destroy();
                                    this.destroy();
                                }
                            });
                            if (boss_plat !== undefined) {
                                boss_plat.bind('UpdateFrame', function () {
                                    this.x = this.x + 2 * Platforms.current_speed;
                                    if (this.x > Platforms.level_x + this.w)
                                        this.destroy();
                                });
                            }
                        }, MonsterSpawn.boss_delay);
                    }
                }
            });
        if (level_y !== Setting.platforms.ground) {
            boss_plat = Crafty.e('2D, Canvas, Floor, ' + Platforms.sprites[2].name)
                .attr({
                    x: Platforms.level_x + Platforms.sprites[2].w,
                    y: level_y,
                    z: MonsterSpawn.z_index_boss
                })
                .bind("UpdateFrame", function () {
                    if (this.x > Platforms.level_x - this.w)
                        this.x = this.x - Platforms.current_speed;
                });
            boss_g.x += boss_plat.w - boss_g.w;
        }


    }

    static get_event_mob_sprite() {
        let free_sprites = [];
        let random_event;
        if (MonsterSpawn.sprite_event_monsters.length !== MonsterSpawn.pseudo_random_events.length) {
            for (let event of MonsterSpawn.sprite_event_monsters) {
                if (MonsterSpawn.pseudo_random_events.indexOf(event.name) === -1) {
                    free_sprites.push(event)
                }
            }
            random_event = free_sprites[getRandomInt(free_sprites.length)];
        }
        else{
            MonsterSpawn.pseudo_random_events = [];
            random_event = MonsterSpawn.sprite_event_monsters[getRandomInt(MonsterSpawn.sprite_event_monsters.length)];
        }
        MonsterSpawn.pseudo_random_events.push(random_event.name);
        return random_event;
    }

    static calc_y_laser(y) {
        switch (y) {
            case MonsterSpawn.boss_available_levels[0]:
                return [MonsterSpawn.boss_available_levels[2] - Platforms.spacing_plat, MonsterSpawn.boss_available_levels[2] - 2 * Platforms.spacing_plat];
            case MonsterSpawn.boss_available_levels[1]:
                return [MonsterSpawn.boss_available_levels[0], MonsterSpawn.boss_available_levels[2] - 2 * Platforms.spacing_plat];
            case MonsterSpawn.boss_available_levels[2]:
                return [MonsterSpawn.boss_available_levels[0], MonsterSpawn.boss_available_levels[1]];
        }
    }
}