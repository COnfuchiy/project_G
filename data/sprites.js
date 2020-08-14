/**
 * Created by Dima on 05.08.2020.
 */

let score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 300,
        y: 0,
        z:10
    });
let score_num = 0;
score_text.text(score_num.toString());
Crafty.e('2D, DOM, Color, Twoway, Gravity,Collision')
    .attr({x: 0, y: 0, w: 10, h: 10})
    .color('#F00')
    .twoway(200,800)
    .gravity('Floor')
    .preventGroundTunneling(true)
    .gravityConst(1250)
    .onHit("GEN_ITEM", function(e) {
        let object = e[0].obj;
        object.destroy();
        score_num+=1;
        score_text.text(score_num.toString());
    })
    .onHit("Floor", function(e) {
        this.resetMotion();
    });
Crafty.e('2D, DOM, Color,Floor')
    .attr({x: 0, y: 400, w: 200, h: 10})
    .color('#2dff00');