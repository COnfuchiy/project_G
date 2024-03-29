/**
 * Created by Dima on 02.09.2020.
 */

function next_scene(block, scene, sound) {
    $('.'+block).detach();
    Crafty.enterScene(scene);
    if (sound)
        Crafty.audio.remove(sound);
}

Crafty.defineScene("Death Screen", function () {
    set_buttons_display(false);
    document.body.style.backgroundColor = '#000';
    Crafty("Delay").each(function() {
        this.destroy();
    });
    Crafty.audio.stop();
    Platforms.stop_loop();
    cd_exchanger.destroy();
    $('.info_table').detach();
    if ($('.baff_table')[0])
        $('.baff_table').detach();
    if ($('.boss_hp_pool')[0])
        $('.boss_hp_pool').detach();
    $('.buttons')[0].style.display = 'none';
    Crafty.viewport.scale(Setting.screen.scale);
    clear_death_data();
    player.bind('UpdateFrame', function () {
        if (this.y > Math.floor(document.documentElement.clientHeight / 1.5)) {
            this.destroy();
            play_game_audio(Setting.soundboard.sound.death.name,1,Setting.soundboard.sound.death.volume);
            let cd_score = 'CD: ' + user_num_cd.toString();
            let current_score ='Score: ' + user_score.toString();
            let total_score ='Total: ' + (user_score+Setting.game.cd_cost*user_num_cd).toString();
            user_score = 0;
            user_num_cd = 0;
            $('body').append('<div class="death-screen"><img src="./sprites/death.png"><div class="total_stats"></div></div>');
            $('.total_stats').append(`
                        <span class="total_label">` + cd_score + `</span>
                        <span class="total_label">` + current_score + `</span>
                        <span class="total_label">` + total_score + `</span>
                    `);
            $('.death-screen').append(`<button class="btn btn--restart" onclick="next_scene('death-screen','Game','`+Setting.soundboard.sound.death.name+`');">Restart</button>`);
        }

    });
});

Crafty.defineScene("Menu", function () {
    if (is_audio)
        menu_sound.play();
    $('.logo').detach();
    $('body').append('<div class="menu-screen"><img src="./sprites/menu-comp.png" class="comp"><div class="comp-gif"><img src="./sprites/start.gif" class="start"></div></div>');
    
    $('.menu-screen').hide();
    
    $('.comp-gif')[0].onclick = function () {
        menu_sound.pause();
        next_scene('menu-screen','Game');
    };
    $('.menu-screen').append(`
        <div class="sound_control `+(is_audio?'sound':'sound_muted')+`"></div>
         <div class="Text game_name"><img class="game_logo" src="./sprites/logo.png"></div>
    `);
    
    $('.menu-screen').fadeIn('slow');
    
    $('.sound_control')[0].onclick = function() {
        stop_music();
        if ($('.sound')[0] !== undefined) {
            $('.sound').addClass('sound_muted');
            $('.sound').removeClass('sound');
        }
        else if ($('.sound_muted')[0] !== undefined) {
            $('.sound_muted').addClass('sound');
            $('.sound_muted').removeClass('sound_muted');
        }
    }
});

Crafty.defineScene("Logo",function () {
    Crafty.e("Delay").delay(function () {
        play_game_audio(Setting.soundboard.sound.logo.name,1,Setting.soundboard.sound.logo.volume);
    },300);
    $('.sound-check').detach();
    $('body').append('<div class="logo"><div class="logo_image"></div></div>');
    $('.logo_image').load('logo.html');
    let logo_delay = Crafty.e("Delay").delay(function () {
        Crafty.enterScene('Menu');
    }, 3000);
    $('.logo')[0].onclick = function () {
        $('.logo').fadeOut();
        next_scene('logo','Menu', 'logo');
        logo_delay.destroy();
    };

});

Crafty.defineScene("Sound Check",function () {
    $('body').append
    (`
        <div class="sound-check">
            <div class="content">
                <img src="./sprites/cookie.png" class="cookie">
                <div class="cookie_request loader"></div>
            </div>
        </div>
    `);

    window.loading_bar = new ldBar(".cookie_request",{
        "preset": "bubble",});
});

Crafty.defineScene("Game", function () {
    document.body.style.backgroundColor = 'grey';
    if (!Crafty.audio.isPlaying(Setting.soundboard.music[0].name)){
        play_game_audio(Setting.soundboard.music[0].name,-1,Setting.soundboard.music[0].volume);
    }
    $('.buttons')[0].style.display = 'block';
    player = create_player();
    set_background();
//set floor
    Crafty.e('2D, Canvas, ' + Platforms.name_component)
        .attr({x: -100, y: Setting.platforms.ground, w: Platforms.level_x+200, h: Platforms.sprites[0].h});
    cd_exchanger_loop(set_cd_exchanger_daley());
//set scale
    Crafty.viewport.scale(Setting.screen.scale);
// cd pic
    create_score_tab();
    set_text(':' + user_num_cd.toString(),'.cd-text');
    set_text('Score:'+user_score.toString(), '.main-score');
    set_text('0/'+total_computer_score.toString(), '.comp-score');
    set_buttons_display(true);
    Platforms.loop();
});

$(document).ready(function () {
    let keyboard_shoot = true;
    $('.button-up').on('touchstart',function(){player.jump()});
    let btn_down = $('.button-down');
    let btn_left = $('.button-left');
    let btn_right = $('.button-right');
    btn_down.on('touchstart',function(){
        let evt = new KeyboardEvent('keydown', {code:'ArrowDown'});
        document.dispatchEvent(evt);
        document.go_down = Crafty.e("Delay").delay(()=>{
            if(player.ground){
                if(player.y<=430){
                    let lost_ground =  player.ground;
                    player.ground.removeComponent('Floor');
                    Crafty.e("Delay").delay(()=>lost_ground.addComponent('Floor'),500);
                }
            }
        },200,-1);
    });
    btn_down.on('touchend', function () {
        document.go_down.destroy();
    });
    btn_left.on('touchstart',function () {
        let evt = new KeyboardEvent('keydown', {'keyCode':37, 'which':37});
        document.dispatchEvent(evt);
    });
    btn_left.on('touchend', function () {
        let evt = new KeyboardEvent('keyup', {'keyCode':37, 'which':37});
        document.dispatchEvent(evt);
    });
    btn_right.on('touchstart',function () {
        let evt = new KeyboardEvent('keydown', {'keyCode':39, 'which':39});
        document.dispatchEvent(evt);
    });
    btn_right.on('touchend',function () {
        let evt = new KeyboardEvent('keyup', {'keyCode':39, 'which':39});
        document.dispatchEvent(evt);
    });
    $('.button-enter').on('touchend',function () {
        if (user_num_cd)
            cd_shoot();
    });
    document.addEventListener('keydown', function(event) {
        if (event.code == 'ArrowDown' || event.code == 'KeyS'){
            if(player.ground)
                if(player.y<=430){
                    let lost_ground =  player.ground;
                    player.ground.removeComponent('Floor');
                    Crafty.e("Delay").delay(()=>lost_ground.addComponent('Floor'),500);
                }
        }
        else if (event.code == "Space")
            if (user_num_cd)
                if (keyboard_shoot){
                    cd_shoot();
                    keyboard_shoot = false;
                }
    });
    document.addEventListener('keyup', function(event) {
        if (event.code == "Space")
            keyboard_shoot = true;
    });
    Crafty.enterScene('Sound Check');
});