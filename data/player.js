/**
 * Created by Dima on 25.08.2020.
 */
let player = Crafty.e('2D, Canvas, Twoway, Gravity,Collision,Motion,player, SpriteAnimation')
    .attr({x: 0, y: 0, z:Setting.player.z_index})
    .reel("run", 900, [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2],
    ])
    .reel('jump',1,[[1,1]])
    .animate("run", -1)
    .twoway(Setting.player.speed,Setting.player.jump_speed)
    .gravity('Floor')
    .gravityConst(Setting.game.gravity_const)
    .onHit("Floor", function(e) {
        let to_ground = e[0].obj;
        to_ground.removeComponent('Floor');
        setTimeout(()=>to_ground.addComponent('Floor'),Setting.player.hit_up_delay);
    })
    .bind('LandedOnGround',function () {
        player.animate("run", -1);
    })
    .bind('CheckLanding',function (e) {
        if (player.ay && e.y<=player.y+player.h && player.dy>0 && e.x-10>=player.x+player.h)
            player.canLand=false;
    })
    .bind('LiftedOffGround',function (e) {
        e.removeComponent('Floor');
        setTimeout(()=>e.addComponent('Floor'),Setting.player.jump_delay);
        player.animate('jump',-1)
    });
