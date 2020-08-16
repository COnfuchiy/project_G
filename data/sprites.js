/**
 * Created by Dima on 05.08.2020.
 */

let player = Crafty.e('2D, Canvas, Color, Twoway, Gravity,Collision,Motion')
    .attr({x: 0, y: 0, z:12, w: 30, h: 30})
    .color('#F00')
    .twoway(400,700)
    .gravity('Floor')
    .gravityConst(2050)
    .onHit("Floor", function(e) {
        if(e[0].obj.y<this.y)
            this.y-=this.y-e[0].obj.y;
        this.resetMotion();
    });
Crafty.e('2D, Canvas, Color,Floor')
    .attr({x: 0, y: 500, w: document.documentElement.clientWidth, h: 20})
    .color('#2dff00');