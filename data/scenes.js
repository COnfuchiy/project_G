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
    //Crafty.background("#000");
    document.body.style.backgroundColor = '#000';
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
    play_game_audio(Setting.soundboard.music[3].name,-1,Setting.soundboard.music[3].volume);
    $('.logo').detach();
    $('body').append('<div class="menu-screen"><img src="./sprites/menu-comp.png" class="comp"><div class="comp-gif"><img src="./sprites/start.gif" class="start"></div></div>');
    $('.comp-gif')[0].onclick = function () {
        next_scene('menu-screen','Game',Setting.soundboard.music[3].name);
    };
    $('.menu-screen').append(`
        <div class="sound_control `+(is_audio?'sound':'sound_muted')+`"></div>
         <div class="Text game-name">Project G</div>
    `);
    
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
        next_scene('logo','Menu', 'logo');
        logo_delay.destroy();
    };

});

Crafty.defineScene("Sound Check",function () {
    $('body').append
    (`
        <div class="sound-check">
            <img src="./sprites/cookie.png" class="cookie">
            <h2 class="cookie_request">Due to f*cking google audio policies, we have to make you tap on this screen.</h2>
        </div>
    `);
    $('.sound-check')[0].onclick = function () {
        next_scene('sound-check','Logo');
    };
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
    Platforms.loop();
});

$(document).ready(function () {
    Crafty.enterScene('Sound Check');
});