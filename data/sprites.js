/**
 * Created by Dima on 05.08.2020.
 */

let player = Crafty.e('2D, Canvas, Color, Twoway, Gravity,Collision,Motion')
    .attr({x: 0, y: 0, z:12, w: 30, h: 30})
    .color('#F00')
    .twoway(400,650)
    .gravity('Floor')
    .gravityConst(2050)
    .onHit("Floor", function(e) {
        // if(e[0].obj.y<this.y)
        //     this.y-=this.y-e[0].obj.y;
        // this.resetMotion();
        let to_ground = e[0].obj;
        to_ground.removeComponent('Floor');
        setTimeout(()=>to_ground.addComponent('Floor'),200);
    });
Crafty.e('2D, Canvas, Color,Floor')
    .attr({x: 0, y: 500, w: document.documentElement.clientWidth, h: 20})
    .color('#2dff00');