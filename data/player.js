/**
 * Created by Dima on 25.08.2020.
 */
let player = Crafty.e('2D, Canvas, Persist, Twoway, Gravity, Collision, Motion, SpriteAnimation, '+Setting.player.name_component)
    .attr({x: Setting.player.start_position.x, y: Setting.player.start_position.y, z:Setting.player.z_index})
    .reel(Setting.player.sprite.animate[0].name, Setting.player.sprite.animate[0].time, Setting.player.sprite.animate[0].reel)
    .reel(Setting.player.sprite.animate[1].name, Setting.player.sprite.animate[1].time, Setting.player.sprite.animate[1].reel)
    .animate(Setting.player.sprite.animate[0].name, -1)
    .twoway(Setting.player.speed,Setting.player.jump_speed)
    .gravity(Platforms.name_component)
    .gravityConst(Setting.game.gravity_const)
    .onHit(Setting.mobs.name_component, function (mob, check_twice) {
        if (check_twice)
            Crafty.trigger('Death');
    })
    .onHit(BossFight.name_component, function(boss, check_twice) {
        if (check_twice)
            Crafty.trigger('Death');
    })
    .onHit(Platforms.name_component, function(e) {
        let to_ground = e[0].obj;
        to_ground.removeComponent(Platforms.name_component);
        Crafty.e("Delay").delay(()=>to_ground.addComponent(Platforms.name_component),Setting.player.hit_up_delay);
    })
    .bind('LandedOnGround',function () {
        player.animate(Setting.player.sprite.animate[0].name, -1);
    })
    .bind('CheckLanding',function (e) {
        //hz how but is work do not mind
        if (player.ay && e.x +10>=player.x+player.w-10 && player.dy>0)
            player.canLand=false;
    })
    .bind('LiftedOffGround',function (e) {
        e.removeComponent(Platforms.name_component);
        Crafty.e("Delay").delay(()=>e.addComponent(Platforms.name_component),Setting.player.jump_delay);
        player.animate(Setting.player.sprite.animate[1].name,-1)
    });
