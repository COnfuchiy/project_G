/**
 * Created by Dima on 05.08.2020.
 */
//useless random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
let user_score=0;
let user_num_cd =0;
let is_active_item=true;
Crafty.bind('Death', function () {
   // here would be death screen
    location.reload();
});
//pc spawn
setInterval(function () {
    setTimeout(function () {
        Crafty.e('2D, Canvas, cd_exchanger, Collision')
            .attr({x:Platforms.level_x, y:450})
            .bind("UpdateFrame", function () {
                this.x = this.x -Platforms.current_speed;
                if (this.x < -this.w)
                    this.destroy();
            })
            .onHit('player',function(e) {
                while (user_score>=500){
                    user_score-=500;
                    user_num_cd++;
                }
                cd_num_text.text(':'+user_num_cd.toString());
                user_score_text.text(user_score.toString());
                this.removeComponent('Collision');
            });
    },2300);
},14000+getRandomInt(12)*1000);
//hz how is working, but is here
let switch_screen = 0;
Crafty.viewport.scale(1.5);
// window.addEventListener("orientationchange", function() {
//     if (document.documentElement.clientWidth<document.documentElement.clientHeight){
//         Crafty.viewport.scale(0.6);
//         switch_screen = 0;
//     }
//     else {
//         Crafty.viewport.scale(1);
//         switch_screen = 1;
//     }
//
// }, false);

// buttons actions

Platforms.loop();
