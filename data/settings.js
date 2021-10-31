/**
 * Created by Dima on 24.08.2020.
 */
let z_index_map = {
    background:0,
    platforms:1,
    dropped_items:2,
    computer:3,
    player:4,
    mobs:{
        sort_walking:5,
        left_walking:6,
        laser:7,
        fly:8,
    },
    boss:3
};
class Setting {
    static soundboard = {
        music:[
            {
                name:'main_theme1',
                volume:0.7
            },
            {
                name:'main_theme2',
                volume:1
            },
            {
                name:'boss_theme',
                volume:0.7
            },
            {
                name:'menu',
                volume:0.6
            }
        ],
        sound:{
            mobs:[
                {
                    name:'laser',
                    volume:0.5
                },
                {
                    name:'cam_bot',
                    volume:0.6
                },
                {
                    name:'walk_bot',
                    volume:0.8
                },
                {
                    name:'skeleton',
                    volume:1
                },
                {
                    name:'fly',
                    volume:0.6
                },
            ],
            player:[
                {
                    name:'shoot',
                    volume:1
                },
                {
                    name:'shield',
                    volume:0.8
                },
                {
                    name:'cd_change',
                    volume:1
                },
                {
                    name:'magnet',
                    volume:0.3
                },
                {
                    name:'shield_active',
                    volume:0.8
                },
                {
                    name:'increase',
                    volume:1
                },

            ],
            items:[
                {
                    name:'item',
                    volume:0.8
                },
                {
                    name:'comp',
                    volume:0.4
                },
            ],
            boss:[
                {
                    name:'g_app',
                    volume:0.8
                },
                {
                    name:'g_hit',
                    volume:0.8
                },
                {
                    name:'g_laugh',
                    volume:1
                },
                {
                    name:'g_move',
                    volume:1
                },
            ],
            logo:{
                name:'logo',
                volume:0.5
            },
            death:{
                name:'death',
                volume:0.7
            }
        },
    };
    static platforms = {
        name_component:'Floor',
        component_for_mob:'MobFloor',
        spacing_plat: 100, //space between platform levels
        num_levels: 4,
        ground:500,
        pseudo_random_platforms: [ //platform type (width) and the delay between the appearance of the next platform in this level
            {
                name: 'platx2',
                delay: 2000
            },
            {
                name: 'platx4',
                delay: 2700
            },
            {
                name: 'platx3',
                delay: 2200
            },
            {
                name: 'plat',
                delay: 1800
            },
            {
                name: 'platx3',
                delay: 2500
            },
            {
                name: 'platx2',
                delay: 2150
            },
            {
                name: 'platx4',
                delay: 2400
            },
        ],
        start_delay: [3000, 1500, 3500, 1700], //start delay between next platform in each levels
        current_speed: 4, //speed moving game left, px in FPS
        z_index: z_index_map.platforms,
        sprites: [
            {
                name: 'plat',
                w: 93,
                h: 20
            },
            {
                name: 'platx2',
                w: 186,
                h: 20
            },
            {
                name: 'platx3',
                w: 279,
                h: 20
            },
            {
                name: 'platx4',
                w: 372,
                h: 20
            },
        ],
    };
    static screen = {
        scale: 1.5, //each pixel on canvas is equal pixel*scale
        width: Math.floor(document.documentElement.clientWidth / 1.5), //canvas width, see scale
        fon_width:567,
        fon_speed:0.5,
        fon_z_index:z_index_map.background,
        fon_number:Math.round(Math.floor(document.documentElement.clientWidth / 1.5)/567)+2
    };
    static items = {
        name_component:'item',
        dropped_items: [ //chance of 100 %
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
                chance: 92,
            },
            {
                sprites: {
                    name: 'wired_keyboard',
                    w: 47,
                    h: 40,
                },
                score: 800,
                chance: 96,
            },

        ],
        special_items: {
            comp: {
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
            },
            baff_items:[
                {
                    sprites: {
                        name: 'usb_coin',
                        w: 59,
                        h: 40,
                    },
                    type:'increase'
                },
                {
                    sprites: {
                        name: 'usb_magnet',
                        w: 59,
                        h: 40,
                    },
                    type:'magnet'
                },
                {
                    sprites: {
                        name: 'usb_shield',
                        w: 59,
                        h: 40,
                    },
                    type:'shield'
                },
            ],
        },
        fly_drop_height: 10,
        chance_drop: 80,
        chance_double_drop: 50,
        computer_chance: 40,
        buff_chance:50,
        z_index_drop:z_index_map.dropped_items,
        z_index_comp:z_index_map.computer,
        magnet_area_name:'absorb',
        magnet_area: 100,
        magnet_speed:6,
        increase_multiplier:2,
        buff_time:7000,//time in msc
        buff_cooldown:3000
    };
    static boss = {
        name_component:'boss',
        min_num_stage:3,
        fly_mob_delay:800,
        fly_mob_speed:2,
        wall_delay:2000,
        boss_fly_speed:{x:(Setting.screen.width>1000?2*Setting.platforms.current_speed:1.2*Setting.platforms.current_speed),y:Setting.platforms.current_speed},
        cd_value_boss:5, //hp decrease for each hit
        boss_delay:2000, // num sec when the boss is standing
        boss_stage:['two_laser', 'two_fly', 'red_laser', 'shield', 'fly_head1','fly_head2'],
        boss_sprite: {
            name: 'proff_G',
            reels: [
                [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],// to left
            ],
            w: 211,
            h: 221,
            time: 300
        },
        boss_head_sprite:{
            name: 'proff_G_head',
            w: 166,
            h: 145,},
        boss_available_levels:[Setting.platforms.ground,
            Setting.platforms.ground-Setting.platforms.spacing_plat,
        ],
        z_index_boss:z_index_map.boss,
    };
    static game = {
        start_num_cd:0,
        start_num_comp: 10, //start number computer for spawn boss
        increase_num_comp: 5, //after boss dead + num_comp
        gravity_const:2050,
        cd_exchanger_min_delay:8000,
        cd_exchanger_max_delay:14000,
        cd_exchanger_delay_step:1000,
        cd_cost:500,
    };
    static player = {
        name_component:'Player',
        sprite:{
            name:'Player',
            animate:[
                {
                    name:'run',
                    reel:[[0, 0], [1, 0], [2, 0],
                        [0, 1], [1, 1], [2, 1],
                        [0, 2], [1, 2],],
                    time:900,
                },
                {
                    name:'jump',
                    reel:[[1,1]],
                    time:1,
                }
            ],
            w:50,
            h:60,
        },
        buff_effect_sprites:[
            {
                name: 'magnet',
                w: 24,
                h: 25,
            },
            {
                name: 'shield',
                w: 90,
                h: 120,
            },
        ],
        start_position:{x:0,y:0},
        cd_speed:10,
        cd_z_index:z_index_map.player,
        speed:300,
        jump_speed:650,
        hit_up_delay:200,//delay(platform off) when jumping onto the platform
        jump_delay:300,//platform jump delay(platform off)
        z_index:z_index_map.player,


    };
    static mobs = {
        name_component:'mob',
        walk_monsters_sprites: [
            {
                name: 'robot_1',
                type: 'sort_walking',
                reels: [
                    [[15, 0], [14, 0], [13, 0], [12, 0], [11, 0], [10, 0], [9, 0], [8, 0]],// to left
                    [[7, 0], [2, 0], [3, 0], [4, 0], [4, 0], [5, 0], [6, 0], [7, 0]] // to right
                ],
                w: 32,
                h: 50,
                time: 800
            },
            {
                name: 'yellow_robot',
                type: 'sort_walking',
                reels: [
                    [[15, 0], [14, 0], [13, 0], [12, 0], [11, 0], [10, 0], [9, 0], [8, 0]],// to left
                    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]] // to right
                ],
                w: 28,
                h: 50,
                time: 650
            },
            {
                name: 'robocat',
                type: 'sort_walking',
                reels: [
                    [[15, 0], [14, 0], [13, 0], [12, 0], [11, 0], [10, 0], [9, 0], [8, 0]],// to left
                    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]] // to right
                ],
                w: 26,
                h: 50,
                time: 500
            },
            {
                name: 'octopus',
                type: 'sort_walking',
                reels: [
                    [[7, 0], [6, 0], [5, 0], [4, 0]],// to left
                    [[0, 0], [1, 0], [2, 0], [3, 0]] // to right
                ],
                w: 30,
                h: 50,
                time: 500
            },
        ],
        walk_monsters_start_pos: Math.floor(Setting.platforms.sprites[0].w/5),
        walk_monsters_time: Setting.platforms.sprites[0].w-2*22,//walk in one direction
        event_monsters_sprites: [
            {
                name: 'skeleton',
                type: 'left_walking',
                reels: [
                    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],// to left
                ],
                w: 49,
                h: 60,
                time: 300
            },
            {
                name: 'cam',
                type: 'left_walking',
                reels: [
                    [[7, 0], [6, 0], [5, 0], [4, 0],],// to left
                ],
                w: 57,
                h: 84,
                time: 300
            },
            {
                name: 'laser',
                type: 'laser',
                reels: [
                    [[0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0]],// before shoot
                    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],[0,6]],// after shoot
                ],
                w: 1300,
                h: 64,
                time: 400
            },
            {
                name: 'fly_bot',
                type: 'fly',
                reels: [
                    [[0, 0], [1, 0], [2, 0], [3, 0]],// fly
                ],
                w: 35,
                h: 52,
                time: 300
            },
            {
                name: 'laser_red',
                type: 'laser_red',
                reels: [
                    [[5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0]],// before shoot
                    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],[6,0]],// after shoot
                ],
                w: 64,
                h: 500,
                time: 500
            },
        ],
        left_walking_jump_speed:650,
        laser_delay:2000, //delay before shoot
        fly_mob_y_speed:Setting.platforms.current_speed,
        walking_speed: 1,
        wall_x_level:Math.floor(Setting.screen.width / 2) - Math.floor(Setting.screen.width * 0.15),
        wall_speed:(Setting.screen.width>1000?Setting.platforms.current_speed:Setting.platforms.current_speed/2),
        destroy_score: 200,
        chance_spawn: 30,
        event_counter: 3,//if current_counter is equal special_mob_counter then spawn mob of sprite_event_monsters
        z_index_mobs:z_index_map.mobs,
        mob_num_life:{
            sort_walking:2,
            left_walking:2,
            fly:2,
        }
    }
}

