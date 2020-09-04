/**
 * Created by Dima on 02.09.2020.
 */

Crafty.defineScene("Death Screen", function () {
    Crafty.background("#000");
    document.body.style.backgroundColor = '#000';
    Crafty.audio.stop();
    Platforms.stop_loop();
    cd_exchanger.destroy();
    $('.buttons').empty();
    Crafty.viewport.scale(Setting.screen.scale);
    player.bind('UpdateFrame', function () {
        if (this.y > Math.floor(document.documentElement.clientHeight / 1.5)) {
            this.destroy();
            let death_sound = new Audio();
            death_sound.src = './sounds/death.mp3';
            death_sound.autoplay = true;
            let cd_score = 'CD: ' + user_num_cd.toString();
            let current_score ='Score: ' + user_score.toString();
            let total_score ='Total: ' + (user_score+Setting.game.cd_cost*user_num_cd).toString();
            $('body').append('<div class="death-screen"><img src="./sprites/death.png"><div class="total_stats"></div></div>');
            $('.total_stats').append(`
                        <span class="total_label">` + cd_score + `</span>
                        <span class="total_label">` + current_score + `</span>
                        <span class="total_label">` + total_score + `</span>
                    `);
            $('.death-screen').append('<button class="btn btn--restart" onclick="location.reload();">Restart</button>');
        }

    });
});

Crafty.defineScene("Menu", function () {
    play_game_audio(Setting.soundboard.music[3].name,-1,Setting.soundboard.music[3].volume);
    $('.logo').detach();
    document.body.style.backgroundColor = 'grey';
    $('body').append('<div class="menu-screen"><img src="./sprites/menu-comp.png" class="comp"><div class="comp-gif"><img src="./sprites/start.gif" class="start"></div></div>');
    $('.comp-gif')[0].onclick = function () {
        Crafty.enterScene('Game');
    };
    $('.menu-screen').append(`
        <div class="sound_control sound"></div>
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
    $('.sound-check').detach();
    $('body').append('<div class="logo"><div class="logo_image"></div></div>');
    $('.logo_image').load('logo.html');
    $('.logo')[0].onclick = function () {
        Crafty.enterScene('Menu');
    };
    Crafty.e("Delay").delay(function () {
        if (!is_game && document.body.style.backgroundColor !== 'grey')
            Crafty.enterScene('Menu');
    }, 5500);
});

Crafty.defineScene("Sound Check",function () {
    $('body').append
    (`
        <div class="sound-check">
            <img src="./sprites/cookie.png" class="cookie">
            <h2 class="cookie_request">We\'re using cookies for fun. Can we?</h2>
        </div>
    `);
    $('.sound-check')[0].onclick = function () {
        Crafty.enterScene('Logo');
    };
});

Crafty.defineScene("Game", function () {
    Crafty.audio.stop('menu');
    is_game = true;
    Crafty.e("Delay").destroy();
    if (!Crafty.audio.isPlaying(Setting.soundboard.music[0].name)){
        play_game_audio(Setting.soundboard.music[0].name,-1,Setting.soundboard.music[0].volume);
    }
    $('.buttons')[0].style.display = 'block';
    $('.menu-screen')[0].style.display = 'none';
    player = create_player();
    set_background();
//set floor
    Crafty.e('2D, Canvas, ' + Platforms.name_component)
        .attr({x: 0, y: Setting.platforms.ground, w: Platforms.level_x, h: Platforms.sprites[0].h});
    cd_exchanger_loop(set_cd_exchanger_daley());
//set scale
    Crafty.viewport.scale(Setting.screen.scale);
// cd pic
    Crafty.e('2D, Canvas, cd').attr({x: 450, y: 525});
// cd score number
    cd_num_text = setText(790, 780, ':' + user_num_cd.toString(), {size: '50px', weight: 'bold'});
// score field
    setText(300, 780, 'Score:', {size: '50px', weight: 'bold'});
// user score number
    user_score_text = setText(500, 780, user_score.toString(), {size: '50px', weight: 'bold'});
// comp score number
    comp_score_text = setText(100, 780, '0/'+total_computer_score.toString(), {size: '50px', weight: 'bold'});
//game left move
    Platforms.loop();
});

$(document).ready(function () {
    Crafty.enterScene('Sound Check');
});