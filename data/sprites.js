/**
 * Created by Dima on 05.08.2020.
 */

let score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 600,
        y: 0,
        z:10
    });
let score_num = 0;
score_text.text(score_num.toString());
Crafty.e('2D, Canvas, Color, Twoway, Gravity,Collision')
    .attr({x: 0, y: 0, w: 30, h: 30})
    .color('#F00')
    .twoway(400,1600)
    .gravity('Floor')
    .preventGroundTunneling(true)
    .gravityConst(2050)
    .onHit("GEN_ITEM", function(e) {
        let object = e[0].obj;
        object.destroy();
        score_num+=1;
        score_text.text(score_num.toString());
    })
    .onHit("Floor", function(e) {
        this.resetMotion();
    });
Crafty.e('2D, Canvas, Color,Floor')
    .attr({x: 0, y: 500, w: document.documentElement.clientWidth, h: 20})
    .color('#2dff00');